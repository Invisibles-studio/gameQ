/* eslint-disable */
import NFTtoChoose from "./LobbyObjects/NFTtoChoose";
import ReactDOM from "react-dom";
import { useMoralis } from "react-moralis";
import coin from "coin.png";
import { setValue, getValue, connectToLobby } from "./FirebaseApi/FirebaseAPI";

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
    "font-family": "Inter",
    "font-style": "normal",
    "font-weight": "400",
    "font-size": "32px",
    "line-height": "39px",
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
    "margin-top": "510px",
    "margin-left": "20px",
    "max-height": "260px",
  },

  play: {
    position: "absolute",
    width: "252px",
    height: "55px",
    left: "834px",
    top: "839px",
    background: "#F7931E",
    "box-shadow":
      "4px 4px 10px rgba(255, 201, 64, 0.25), inset 10px 10px 20px #FFC940",
    "border-radius": "15px",
  },

  coin: {
    position: "absolute",
    width: "308px",
    height: "311px",
    left: "806px",
    top: "134px",
    background: "url(coin.png)",
  },

  player1: {
    position: "absolute",
    width: "92px",
    height: "30px",
    left: "312px",
    top: "265px",
    "font-weight": "400",
    "font-size": "25px",
    "line-height": "30px",
    color: "#D0D0CF",
  },

  player1Nft: {
    position: "absolute",
    width: "292px",
    height: "292px",
    left: "454px",
    top: "139px",

    border: "1px solid #6C6661",
    "box-sizing": "border-box",
    filter: "drop-shadow(-11px 4px 25px rgba(31, 31, 31, 0.6))",
    "border-radius": "20px",
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
    "box-sizing": "border-box",
    filter: "drop-shadow(-11px 4px 25px rgba(31, 31, 31, 0.6))",
    "border-radius": "20px",
  },
  player2: {
    position: "absolute",
    width: "92px",
    height: "30px",
    left: "1516px",
    top: "265px",
    "font-weight": "400",
    "font-size": "25px",
    "line-height": "30px",
    color: "#D0D0CF",
  },

  play2: {
    position: "absolute",
    width: "252px",
    height: "55px",
    left: "500px",
    top: "839px",
    background: "#F7931E",
    "box-shadow":
      "4px 4px 10px rgba(255, 201, 64, 0.25), inset 10px 10px 20px #FFC940",
    "border-radius": "15px",
  },
};

export default function Lobbies() {
  const { account, isAuthenticated } = useMoralis();
  return (
    <div style={styles.screen1}>
      <p style={styles.selectText}>Select NFT you want to play for</p>
      <div id="player1Area" style={{ display: "none" }}>
        <p style={styles.player1}>Player 1</p>
        <img id="selectedImg" style={styles.player1Nft} />
        <input type="hidden" id="tokenAddress" value=""/>
        <input type="hidden" id="tokenID" value=""/>
        <input type="hidden" id="tokenImage" value=""/>
      </div>
      <div id="player2Area" style={{ display: "none" }}>
        <p style={styles.player2}>Player 2</p>
        <img id="selectedImg2" style={styles.player2Nft} />
      </div>
      <img style={styles.coin} src={coin} />
      <div style={styles.line1} />
      <div style={styles.nfts}>
        <NFTtoChoose />
      </div>
      <div style={styles.line2} />
      <input type="button" style={styles.play} id="play" value="Play" onClick={() => createNewLobby(account, isAuthenticated)} />
      <script></script>
    </div>
  );
}

export function drawImage2NFT(data, player){
  const tokenImage = data["player-"+player]["nftTransfer"]["tokenImage"]
  document.getElementById("selectedImg2").src = tokenImage || "error"
}

export function createNewLobby(account, isAuthenticated) {
  const tokenAddress = document.getElementById("tokenAddress").value;
  const tokenID = document.getElementById("tokenID").value;
  const tokenImage = document.getElementById("tokenImage").value;
  const userID = account;
  console.log(isAuthenticated)
  getValue((x, data) => {
      if (x == null){
        console.log("Lobby not founded!")
        setValue("1", userID, tokenAddress, tokenID, null, tokenImage, (json) => {
          if (json == null) return
          if (json.hasOwnProperty("player-2")){
            const image2 = json["player-2"]["nftTransfer"]["tokenImage"]
            document.getElementById("selectedImg2").src = image2
          }
          console.log(json)
        })
        console.log("Lobby was created!")
      }
      else{
        connectToLobby(x, userID, tokenAddress, tokenID, tokenImage)
        drawImage2NFT(data, "1")
        console.log("Connected to lobby!")
      }
      
      document.getElementById("play").disabled = true

    })
}

export function closeNftChoose() {
  ReactDOM.render(
    <button onClick={chooseNft}>Create new lobby</button>,
    document.getElementById("root"),
  );
}

export function chooseNft() {
  ReactDOM.render(<h1>ewfewfewfef</h1>, document.getElementById("choosing"));
}
