/* eslint-disable */
import NFTtoChoose from "./LobbyObjects/NFTtoChoose";
import ReactDOM from "react-dom";
import coin from "coin.png";
import coinBack from "coin2.png";
import {
  setValue,
  getValue,
  connectToLobby,
  setGameWinner,
  removeLobbie,
} from "./FirebaseApi/FirebaseAPI";
import "./coinFlip.css";
import { async } from "@firebase/util";
//import "./ContractApi"
//const [modalActive, setModelActive] = useState(true);

const styles = {
  screen1: {
    position: "relative",
    background: "#000000",
    width: "1920px",
    height: "964px",
  },

  selectText: {
    position: "absolute",
    width: "477px",
    height: "39px",
    left: "721px",
    top: "65px",
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "32px",
    lineHeight: "39px",
    color: "#D0D0CF",
  },

  line1: {
    position: "absolute",
    width: "1610px",
    height: "0px",
    left: "155px",
    top: "475px",
    border: "1px solid #6C6661",
  },

  line2: {
    position: "absolute",
    width: "1610px",
    height: "0px",
    left: "155px",
    top: "805px",
    border: "1px solid #6C6661",
  },

  nfts: {
    width: "1880px",
    height: "260px",
    marginTop: "510px",
    marginLeft: "20px",
    maxHeight: "260px",
  },

  play: {
    position: "absolute",
    width: "252px",
    height: "55px",
    left: "834px",
    top: "839px",
    background: "#F7931E",
    boxShadow:
      "4px 4px 10px rgba(255, 201, 64, 0.25), inset 10px 10px 20px #FFC940",
    borderRadius: "15px",
  },

  coinBlock: {
    position: "absolute",
    left: "806px",
    top: "134px",
  },

  coin: {
    position: "absolute",
    width: "308px",
    height: "311px",
  },

  player1: {
    position: "absolute",
    width: "92px",
    height: "30px",
    left: "312px",
    top: "265px",
    fontWeight: "400",
    fontSize: "25px",
    lineHeight: "30px",
    color: "#D0D0CF",
  },

  player1Nft: {
    position: "absolute",
    width: "292px",
    height: "292px",
    left: "454px",
    top: "139px",

    border: "1px solid #6C6661",
    boxSizing: "border-box",
    filter: "drop-shadow(-11px 4px 25px rgba(31, 31, 31, 0.6))",
    borderRadius: "20px",
  },

  selectedNft: {
    width: "100%",
    height: "100%",
  },

  player2Nft: {
    position: "absolute",
    width: "292px",
    height: "292px",
    left: "1174px",
    top: "139px",

    border: "1px solid #6C6661",
    boxSizing: "border-box",
    filter: "drop-shadow(-11px 4px 25px rgba(31, 31, 31, 0.6))",
    borderRadius: "20px",
  },

  player2: {
    position: "absolute",
    width: "92px",
    height: "30px",
    left: "1516px",
    top: "265px",
    fontWeight: "400",
    fontSize: "25px",
    lineHeight: "30px",
    color: "#D0D0CF",
  },

  play2: {
    position: "absolute",
    width: "252px",
    height: "55px",
    left: "500px",
    top: "839px",
    background: "#F7931E",
    boxShadow:
      "4px 4px 10px rgba(255, 201, 64, 0.25), inset 10px 10px 20px #FFC940",
    borderRadius: "15px",
  },
};

export default function Lobbies() {
  const { account, isAuthenticated, Moralis, chainId } = useMoralis();

  async function transfer(isOwner = false) {
    if (isOwner) {
      if (chainId === "0x3") {
        window.curGameContract = game_contract_ropsten;
        //строчка записи в базу curGameContract типа играем на нем
      } else {
        window.curGameContract = game_contract_mumbai;
        //строчка записи в базу curGameContract типа играем на нем
      }
    } else {
      window.curGameContract = ""; //вместо "" достать из базы контракт
    }

    console.log(window.curGameContract);
    const nft = window.chosenNFT;
    console.log(nft);
    const options = {
      type: nft?.contract_type?.toLowerCase(),
      tokenId: nft?.token_id,
      receiver: window.curGameContract,
      contractAddress: nft?.token_address,
    };

    if (options.type === "erc1155") {
      options.amount = 1 ?? nft.amount;
    }

    console.log(options);
    const tx = await Moralis.transfer(options);
    await tx.wait(3);
    console.log(tx);
    if (isOwner) {
      return signContract(nft);
    } else {
      nonOwnerSignContract(nft);
    }
  }

  async function signContract(nft) {
    const options = {
      contractAddress: window.curGameContract,
      functionName: "startBet",
      abi: ABI,
      params: {
        _choice: 0,
        _sellerContract: nft?.token_address,
        _sellerNftId: nft?.token_id,
      },
    };
    console.log(options);
    try {
      const trn = await Moralis.executeFunction(options);
      const reciept = await trn.wait(3);
      console.log(reciept);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }

    console.log(trn);
  }

  function createNewLobby() {
    const tokenAddress = document.getElementById("tokenAddress").value;
    const tokenID = document.getElementById("tokenID").value;
    const tokenImage = document.getElementById("tokenImage").value;
    const userID = account;
    console.log(isAuthenticated);
    getValue((x, data) => {
      if (x == null) {
        console.log("Lobby not founded!");
        document.getElementById("GameStatus").innerHTML =
          "Confirm the contract";
        transfer(true).then((result) => {
          if (result) {
            setValue(
              "1",
              userID,
              tokenAddress,
              tokenID,
              null,
              tokenImage,
              (json) => {
                if (json == null) return;
                if (json.hasOwnProperty("player-2")) {
                  const image2 = json["player-2"]["nftTransfer"]["tokenImage"];
                  document.getElementById("selectedImg2").src = image2;
                  document.getElementById("GameStatus").innerHTML =
                    "Game is start!";
                }
                if (json.hasOwnProperty("winner")) {
                  rotate();
                  const winner = json["winner"];
                  console.log("winner: " + winner);
                  console.log("My account: " + account);
                  if (winner.toString() === account.toString()) {
                    document.getElementById("GameStatus").innerHTML =
                      "You win!";
                  } else {
                    document.getElementById("GameStatus").innerHTML =
                      "You loose!";
                  }
                  const id = window.gameId;
                  removeLobbie(id);
                }
                console.log(json);
              },
            );
            console.log("Lobby was created!");
            document.getElementById("GameStatus").innerHTML =
              "Waiting for the player";
          }
        });
      } else {
        window.gameId = x;
        connectToLobby(x, userID, tokenAddress, tokenID, tokenImage);
        drawImage2NFT(data, "1");
        console.log("Connected to lobby!");
        document.getElementById("GameStatus").innerHTML =
          "Confirm the contract";
        transfer().then(() => {
          document.getElementById("GameStatus").innerHTML = "Game is start!";
        });
      }

      document.getElementById("play").disabled = true;
    });
  }

  function drawImage2NFT(data, player) {
    const tokenImage = data["player-" + player]["nftTransfer"]["tokenImage"];
    document.getElementById("selectedImg2").src = tokenImage || "error";
  }

  async function nonOwnerSignContract(nft) {
    const options = {
      contractAddress: window.curGameContract,
      functionName: "joinBet",
      abi: ABI,
      params: {
        _id: 0, // тут надо высрать id
        _buyerContract: nft?.token_address,
        _buyerNftId: nft?.token_id,
      },
    };
    const trn = await Moralis.executeFunction(options);
    const reciept = await trn.wait(3);
    const winner = reciept["events"][2]["args"]["_winner"].toLowerCase();
    console.log("winner: " + winner);
    console.log(account);
    const gameID = window.gameId;
    rotate();
    if (account.toString() === winner.toString()) {
      document.getElementById("GameStatus").innerHTML = "You win!";
    } else {
      document.getElementById("GameStatus").innerHTML = "You loose!";
    }
    setGameWinner(gameID, winner);
    console.log(reciept);
  }

  function rotate() {
    var red = document
      .querySelector("#myCard")
      .style.setProperty(
        "--animation-time",
        (Math.floor(Math.random() * 10) * 180).toString() + "deg",
      );
    document.querySelector("#myCard").classList.toggle("flip-container-hover");
  }

  return (
    <div style={styles.screen1}>
      <p style={styles.selectText} id="GameStatus">
        Select NFT you want to play for
      </p>
      <div id="player1Area" style={{ display: "none" }}>
        <p style={styles.player1}>Player 1</p>
        <img id="selectedImg" style={styles.player1Nft} />
        <input type="hidden" id="tokenAddress" value="" />
        <input type="hidden" id="tokenID" value="" />
        <input type="hidden" id="tokenImage" value="" />
      </div>
      <div id="player2Area" style={{ display: "none" }}>
        <p style={styles.player2}>Player 2</p>
        <img id="selectedImg2" style={styles.player2Nft} />
      </div>
      <div
        className="flip-container vertical"
        id="myCard"
        style={styles.coinBlock}
      >
        <div className="flipper">
          <div className="front">
            <img style={styles.coin} src={coin} />
          </div>
          <div className="back">
            <img style={styles.coin} src={coinBack} />
          </div>
        </div>
      </div>
      <div style={styles.line1} />
      <div style={styles.nfts}>
        <NFTtoChoose />
      </div>
      <div style={styles.line2} />
      <input
        type="button"
        style={styles.play}
        id="play"
        value="Play"
        onClick={() => createNewLobby()}
      />
      <script></script>
    </div>
  );
}

const game_contract_mumbai = "0x7c2d321db8771ebe3937d213cb9f03af2b947c32";
const game_contract_ropsten = "0x95feb63ce8ca5c4a71c1e48fa2f34b7177b87e95";
const ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_buyerContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_buyerNftId",
        type: "uint256",
      },
    ],
    name: "joinBet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_winner",
        type: "address",
      },
    ],
    name: "joinBetEvent",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_choice",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_sellerContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_sellerNftId",
        type: "uint256",
      },
    ],
    name: "startBet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "startBetEvent",
    type: "event",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "bets",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        internalType: "address",
        name: "sellerContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "sellerNftId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "sellerNFTCount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        internalType: "address",
        name: "buyerContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "buyerNftId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "buyerNFTCount",
        type: "uint256",
      },
      {
        internalType: "enum BetBook.Side",
        name: "sellerCh",
        type: "uint8",
      },
      {
        internalType: "enum BetBook.Side",
        name: "result",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "pendingWithdraws",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
