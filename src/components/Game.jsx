/* eslint-disable */
import NFTtoChoose from "./LobbyObjects/NFTtoChoose";
import ReactDOM from "react-dom";
import { useMoralis, useNFTBalances } from "react-moralis";
import mainStyle from "./game.css";
import coinMain from "coin2.png";
import gameIcon from "gameIcon.png";
import notFoundNft from "notFoundNft.jpg";
import Scrollable from "./Scrollable";
import { useVerifyMetadata } from "../hooks/useVerifyMetadata";
import { Skeleton } from "antd";
import {
  addNftToSearch,
  getAllOffersWithoutMy,
} from "./FirebaseApi/FirebaseAPI";
import { useState } from "react";
import CustomAuth from "components/CustomAuth";
import topBlockGR from "TopBlockGR.png";
import coinBackgroundGR from "coinBackgroundGR.png";
import FontCoin from "images/font.png";
import BackCoin from "images/back.png";
import { useMoralisWeb3Api } from "react-moralis";
import "./coinFlip.css";
import {
  AcceptOffer,
  CheckApproval,
  ClaimReward,
  CreateLobby,
  CreateOffer,
  GetActiveLobbies,
  GetApproval,
  GetBetById,
  GetBetsInLobby,
  GetBlock,
  GetLobbyById,
  getNftMetadata,
  GetWinner,
  WithdrawOffer,
} from "components/ContractApi";

export default function Game() {
  const { account, isAuthenticated, Moralis, chainId } = useMoralis();
  const [offers, setOffers] = useState([]);
  const [selectedNft, setSelectedNft] = useState(null);
  const [selectedOfferNft, setSelectedOfferNft] = useState(null);
  const [selectedLobby, setSelectedLobby] = useState(null);
  const [createdOffer, setCreatedOffer] = useState(null);

  const { data: NFTBalances } = useNFTBalances();
  const { verifyMetadata } = useVerifyMetadata();

  const gameInterval = 5000;

  const Web3Api = useMoralisWeb3Api();

  const allNftItems = [...document.querySelectorAll(".NftItem")];

  function selectNft(nft, index) {
    console.log(nft);
    allNftItems.map((el) => {
      el.classList.remove("NftItemSelected");
    });

    document
      .getElementById("nft-id" + index.toString())
      .classList.add("NftItemSelected");
    document.querySelector(".line1").classList.add("line1SelectedNft");
    document.querySelector(".line2").classList.add("line2SelectedNft");

    setSelectedNft(nft);

    document.getElementById("tokenAddress").value = nft.token_address;
    document.getElementById("tokenID").value = nft.token_id;
    document.getElementById("tokenImage").value = nft.image;
    document.getElementById("tokenName").value =
      nft.metadata.name != null ? nft.metadata.name : "null";
  }

  function addOffer() {
    if (!window.isOffersShow && window.isCreate) {
      document.querySelector(".nftsContainer").classList.add("hidden");
      document.querySelector(".line1").classList.add("line1SelectedNft2");
      document.querySelector(".line2").classList.add("line2SelectedNft2");
      editStatus("Select game offer");

      createLobby();
    } else {
      const offerID = document.getElementById("selectedOffer").value;
      if (offerID != "") {
        console.log("TRUE : " + offerID);
      }
    }

    if (!window.isCreate && selectedLobby != null) {
      document.querySelector(".line1").classList.remove("line1SelectedNft2");
      document.querySelector(".line2").classList.remove("line2SelectedNft2");

      document.querySelector(".nftsContainer").classList.remove("hidden");
      setOffers([]);
    }

    if (!window.isCreate && selectedNft != null && selectedLobby != null) {
      CheckApproval(selectedNft, account, Moralis, (isApproval) => {
        if (!isApproval) {
          GetApproval(selectedNft, Moralis, (isA, json) => {
            CreateOffer(
              selectedLobby.id,
              selectedNft,
              0,
              Moralis,
              (isSigned, bet) => {
                if (isSigned) {
                  setCreatedOffer(bet);
                  waitNftSelect();
                }
              },
            );
          });
        } else {
          CreateOffer(
            selectedLobby.id,
            selectedNft,
            0,
            Moralis,
            (isSigned, bet) => {
              if (isSigned) {
                setCreatedOffer(bet);
                waitNftSelect();
              }
            },
          );
        }
      });
    }

    if (window.isCreate && window.isOffersShow && selectedOfferNft != null) {
      offerSelect();
    }
  }

  function waitNftSelect() {
    document.querySelector(".GameWindow1").classList.add("hidden");
    document.querySelector(".WaitGameStart").classList.remove("hidden");

    setImageInBlockWait(1, selectedNft.image);
    setImageInBlockWait(2, selectedLobby.nftTransfer.tokenImage);

    let interval = setInterval(() => {
      GetLobbyById(selectedLobby.id, Moralis, (json) => {
        console.log(json);

        if (
          json.opponent.toString().toLowerCase() ===
          "0x0000000000000000000000000000000000000000"
        )
          return;

        if (
          json.opponent.toString().toLowerCase() ===
          account.toString().toLowerCase()
        ) {
          showGameResults();
          clearInterval(interval);
        } else {
          document.querySelector(".NftNotSelected").classList.remove("hidden");
          clearInterval(interval);
        }
      });
    }, 1000);
  }

  function selectOffer(el, index) {
    const allOffersItems = [...document.querySelectorAll(".offerItem")];
    document.getElementById("selectedOffer").value = el.id;

    allOffersItems.map((element) => {
      element.classList.remove("offerItemSelected");
    });

    document
      .querySelector("#offer-id" + index.toString())
      .classList.add("offerItemSelected");

    if (!window.isCreate) {
      setSelectedLobby(el);
    } else {
      setSelectedOfferNft(el);
    }
  }

  function createGame() {
    document.querySelector(".GameWindow1").classList.remove("hidden");
    document.querySelector(".GameWindowStart").classList.add("hidden");
    //document.querySelector(".coin").classList.add("coinWork")
    window.isCreate = true;
  }

  function findGame() {
    document.querySelector(".GameWindow1").classList.remove("hidden");
    document.querySelector(".GameWindowStart").classList.add("hidden");
    //document.querySelector(".coin").classList.add("coinWork")

    document.querySelector(".line1").classList.add("line1SelectedNft2");
    document.querySelector(".line2").classList.add("line2SelectedNft2");

    GetActiveLobbies(Moralis, (array) => {
      showLobbiesInUI(array);
      window.isOffersShow = true;
    });

    document.querySelector(".nftsContainer").classList.add("hidden");
  }

  function showLobbiesInUI(lobbies) {
    let tmp = [];
    let count = 0;
    let visibledLobby = 0;

    for (let lobbyIndex in lobbies) {
      let lobby = lobbies[lobbyIndex];

      if (
        lobby.creator.toString().toLowerCase() ===
        account.toString().toLowerCase()
      )
        continue;
      if (
        lobby.creator.toString().toLowerCase() ===
        "0x0000000000000000000000000000000000000000"
      )
        continue;

      count++;

      GetBetById(lobby.creatorBet, Moralis, (offer) => {
        getNftMetadata(offer.NFT, offer.NFTId, Moralis, (nftData) => {
          fetch(nftData)
            .then((result) => result.json())
            .then((out) => {
              tmp.push({
                nftTransfer: {
                  tokenImage:
                    "https://ipfs.io/ipfs/" + out.image.split("//")[1],
                  tokenName: out.name,
                  tokenAddress: offer.NFT,
                  tokenID: offer.NFTId,
                },
                UserID: offer.user,
                id: lobby.lobbyId,
              });
            });
        });
      });
    }

    if (count > 0) {
      let interval = setInterval(() => {
        if (tmp.length > visibledLobby) {
          setOffers([]);
          setOffers(tmp);
          visibledLobby++;
        }

        console.log(
          "have: " + count.toString() + " : loaded: " + tmp.length.toString(),
        );

        if (tmp.length === count) {
          setOffers([]);
          setOffers(tmp);
          window.isOffersShow = true;
          clearInterval(interval);
        }
      }, 100);
    }
  }

  function showOffersInUI(offersList) {
    let tmp = [];
    let count = 0;
    let visibledOffers = 0;

    for (let nftIndex in offersList) {
      let nft = offersList[nftIndex];

      if (
        nft.user.toString().toLowerCase() === account.toString().toLowerCase()
      )
        continue;
      count++;
      getNftMetadata(nft.NFT, nft.NFTId, Moralis, (nftData) => {
        fetch(nftData)
          .then((result) => result.json())
          .then((out) => {
            tmp.push({
              nftTransfer: {
                tokenImage: "https://ipfs.io/ipfs/" + out.image.split("//")[1],
                tokenName: out.name,
                tokenAddress: nft.NFT,
                tokenID: nft.NFTId,
              },
              UserID: account,
              id: nft.betId,
            });
          });
      });
    }

    if (count > 0) {
      let interval = setInterval(() => {
        if (tmp.length > visibledOffers) {
          setOffers([]);
          setOffers(tmp);
          visibledOffers++;
        }

        console.log(
          "have: " + count.toString() + " : loaded: " + tmp.length.toString(),
        );

        if (tmp.length === count) {
          setOffers([]);
          setOffers(tmp);
          window.isOffersShow = true;
          clearInterval(interval);
        }
      }, 100);
    }
  }

  function editStatus(string) {
    document.getElementById("statusBlock").innerHTML = string;
  }

  function createLobby() {
    CheckApproval(selectedNft, account, Moralis, (isApproval) => {
      if (!isApproval) {
        GetApproval(selectedNft, Moralis, (isA, json) => {
          createLobby();
        });
      } else {
        window.isLobbyOpen = true;
        CreateLobby(selectedNft, 0, Moralis, (isSigned, json) => {
          setSelectedLobby(json);

          let updateOffers = setInterval(() => {
            GetLobbyById(json.lobby.lobbyId, Moralis, (json2) => {
              if (json2.lobbyStatus !== 0) {
                window.isLobbyOpen = false;
              }
            });
            if (window.isLobbyOpen) {
              GetBetsInLobby(json.lobby.lobbyId, Moralis, (bets) => {
                showOffersInUI(bets);
              });
            } else {
              clearInterval(updateOffers);
            }
          }, 1000);
        });
      }
    });
  }

  function setImageInBlockWait(player = 1, src) {
    switch (player) {
      case 1:
        document.querySelector("#PlayerBlockWaitImage1").src = src;
        break;
      case 2:
        document.querySelector("#PlayerBlockWaitImage2").src = src;
        break;
    }
  }

  function setImageInGameResults(player = 1, src) {
    switch (player) {
      case 1:
        document.querySelector("#Player1ImgGR").src = src;
        break;
      case 2:
        document.querySelector("#Player2ImgGR").src = src;
        break;
    }
  }

  function cancelOffer() {
    WithdrawOffer(createdOffer.bet.betId, Moralis, (isSign, json) => {
      if (isSign) {
        window.location.reload();
      }
    });
  }

  function showGameResultsCreator() {
    window.isLobbyOpen = false;

    document.querySelector(".GameWindow1").classList.add("hidden");
    document.querySelector(".GameResults").classList.remove("hidden");

    setImageInGameResults(1, selectedNft.image);
    setImageInGameResults(2, selectedOfferNft.nftTransfer.tokenImage);

    let bn = 0;
    GetLobbyById(selectedLobby.lobby.lobbyId, Moralis, (json) => {
      let blockNumber = json.blockNumber;
      let position = json.gameNumber;
      /* if (blockNumber > position) {
        blockNumber = position;
      }*/
      bn = blockNumber;
      let creatorHash = json.creatorHash;
      let opponentHash = json.opponentHash;

      window.CreatorHash = creatorHash;
      window.OpponentHash = opponentHash;

      let oHashLetters = "";
      let oHashDigits = "";

      for (let i in window.CreatorHash) {
        if (i <= 5) continue;

        let letter = window.CreatorHash[i];
        if (letter !== "0" && letter >= "1" && letter <= "9")
          oHashDigits += letter + " ";
        else if (letter !== "0") oHashLetters += letter + " ";
      }

      setPlayerHashGameResult(1, oHashLetters, oHashDigits);

      let oHashLetters2 = "";
      let oHashDigits2 = "";

      for (let i in window.OpponentHash) {
        if (i <= 5) continue;

        let letter = window.OpponentHash[i];
        if (letter !== "0" && letter >= "1" && letter <= "9")
          oHashDigits2 += letter + " ";
        else if (letter !== "0") oHashLetters2 += letter + " ";
      }

      setPlayerHashGameResult(2, oHashLetters2, oHashDigits2);

      setDataInTopBlock(position, blockNumber);
    });

    let interval2 = setInterval(() => {
      GetBlock(Web3Api, chainId.toString()).then((json) => {
        if (json > bn) return;
        document.querySelector("#currentBlockTBGR").innerHTML = json;
      });
    }, gameInterval);

    let interval = setInterval(() => {
      GetWinner(selectedLobby.lobby.lobbyId, Moralis, (json) => {
        console.log(json);

        let winnerAccount = json.address.toLowerCase();

        if (winnerAccount === "0x0000000000000000000000000000000000000000")
          return;

        let blockHash = json.blockHash; //'Hash: 0x267a78849675F05B86fb0766d6aB6aA466910A6'
        let position = json.index;

        if (winnerAccount === account.toString().toLowerCase()) {
          setWinnerTextGameResult(1);

          let oHashLetters = "";
          let oHashDigits = "";

          for (let i in window.OpponentHash) {
            if (i <= 5) continue;

            let letter = window.OpponentHash[i];
            if (
              letter === blockHash[position] &&
              letter !== "0" &&
              letter >= "1" &&
              letter <= "9"
            )
              oHashDigits +=
                '<span class="yellowForHash">' + letter + "</span>" + " ";
            else if (letter !== "0" && letter >= "1" && letter <= "9")
              oHashDigits += letter + " ";
            else if (letter !== "0" && letter === blockHash[position])
              oHashLetters +=
                '<span class="yellowForHash">' + letter + "</span>" + " ";
            else if (letter !== "0") oHashLetters += letter + " ";
          }

          setPlayerHashGameResult(1, oHashLetters, oHashDigits);
        } else {
          setWinnerTextGameResult(2);

          let oHashLetters = "";
          let oHashDigits = "";

          for (let i in window.OpponentHash) {
            if (i <= 5) continue;

            let letter = window.OpponentHash[i];
            if (
              letter === blockHash[position] &&
              letter !== "0" &&
              letter >= "1" &&
              letter <= "9"
            )
              oHashDigits +=
                '<span class="yellowForHash">' + letter + "</span>" + " ";
            else if (letter !== "0" && letter >= "1" && letter <= "9")
              oHashDigits += letter + " ";
            else if (letter !== "0" && letter === blockHash[position])
              oHashLetters +=
                '<span class="yellowForHash">' + letter + "</span>" + " ";
            else if (letter !== "0") oHashLetters += letter + " ";
          }

          setPlayerHashGameResult(2, oHashLetters, oHashDigits);
        }

        let bHash = "Hash: ";

        for (let i in blockHash) {
          if (i == position) {
            bHash += '<span class="yellowForHash">' + blockHash[i] + "</span>";
          } else bHash += blockHash[i];
        }

        setDataInBottomBlock(bHash);

        rotate();

        clearInterval(interval);
        clearInterval(interval2);
      });
    }, gameInterval);
  }

  function showGameResults() {
    window.isLobbyOpen = false;

    document.querySelector(".WaitGameStart").classList.add("hidden");
    document.querySelector(".GameResults").classList.remove("hidden");

    setImageInGameResults(1, selectedNft.image);
    setImageInGameResults(2, selectedLobby.nftTransfer.tokenImage);
    let bn = 0;
    GetLobbyById(selectedLobby.id, Moralis, (json) => {
      let position = json.gameNumber;
      let blockNumber = json.blockNumber;
      /* if (blockNumber > position) {
        blockNumber = position;
      }*/
      bn = blockNumber;
      let creatorHash = json.creatorHash;
      let opponentHash = json.opponentHash;
      window.CreatorHash = creatorHash;
      window.OpponentHash = opponentHash;

      let oHashLetters = "";
      let oHashDigits = "";

      for (let i in window.CreatorHash) {
        if (i <= 5) continue;

        let letter = window.CreatorHash[i];
        if (letter !== "0" && letter >= "1" && letter <= "9")
          oHashDigits += letter + " ";
        else if (letter !== "0") oHashLetters += letter + " ";
      }

      setPlayerHashGameResult(2, oHashLetters, oHashDigits);

      let oHashLetters2 = "";
      let oHashDigits2 = "";

      for (let i in window.OpponentHash) {
        if (i <= 5) continue;

        let letter = window.OpponentHash[i];
        if (letter !== "0" && letter >= "1" && letter <= "9")
          oHashDigits2 += letter + " ";
        else if (letter !== "0") oHashLetters2 += letter + " ";
      }

      setPlayerHashGameResult(1, oHashLetters2, oHashDigits2);

      setDataInTopBlock(position, blockNumber);
    });

    let interval2 = setInterval(() => {
      GetBlock(Web3Api, chainId.toString()).then((json) => {
        if (json > bn) return;
        document.querySelector("#currentBlockTBGR").innerHTML = json;
      });
    }, gameInterval);

    let interval = setInterval(() => {
      GetWinner(selectedLobby.id, Moralis, (json) => {
        console.log(json);

        let winnerAccount = json.address.toLowerCase();

        if (winnerAccount === "0x0000000000000000000000000000000000000000")
          return;

        let blockHash = json.blockHash; //'Hash: 0x267a78849675F05B86fb0766d6aB6aA466910A6'
        let position = json.index;

        if (winnerAccount === account.toString().toLowerCase()) {
          setWinnerTextGameResult(1);

          let oHashLetters = "";
          let oHashDigits = "";

          for (let i in window.OpponentHash) {
            if (i <= 5) continue;

            let letter = window.OpponentHash[i];
            if (
              letter === blockHash[position] &&
              letter !== "0" &&
              letter >= "1" &&
              letter <= "9"
            )
              oHashDigits +=
                '<span class="yellowForHash">' + letter + "</span>" + " ";
            else if (letter !== "0" && letter >= "1" && letter <= "9")
              oHashDigits += letter + " ";
            else if (letter !== "0" && letter === blockHash[position])
              oHashLetters +=
                '<span class="yellowForHash">' + letter + "</span>" + " ";
            else if (letter !== "0") oHashLetters += letter + " ";
          }

          setPlayerHashGameResult(1, oHashLetters, oHashDigits);
        } else {
          setWinnerTextGameResult(2);

          let oHashLetters = "";
          let oHashDigits = "";

          for (let i in window.OpponentHash) {
            if (i <= 5) continue;

            let letter = window.OpponentHash[i];
            if (
              letter === blockHash[position] &&
              letter !== "0" &&
              letter >= "1" &&
              letter <= "9"
            )
              oHashDigits +=
                '<span class="yellowForHash">' + letter + "</span>" + " ";
            else if (letter !== "0" && letter >= "1" && letter <= "9")
              oHashDigits += letter + " ";
            else if (letter !== "0" && letter === blockHash[position])
              oHashLetters +=
                '<span class="yellowForHash">' + letter + "</span>" + " ";
            else if (letter !== "0") oHashLetters += letter + " ";
          }

          setPlayerHashGameResult(2, oHashLetters, oHashDigits);
        }

        let bHash = "Hash: ";

        for (let i in blockHash) {
          if (i == position) {
            bHash += '<span class="yellowForHash">' + blockHash[i] + "</span>";
          } else bHash += blockHash[i];
        }

        rotate();

        setDataInBottomBlock(bHash);

        clearInterval(interval);
        clearInterval(interval2);
      });
    }, gameInterval);
  }

  function setWinnerTextGameResult(player = 1) {
    document.querySelector("#WinnerBlockGR").classList.remove("hidden");
    switch (player) {
      case 1:
        document.querySelector("#WinnerBlockGR").classList.add("Winner1TextGR");
        document.querySelector(".ClaimWinningsGR").classList.remove("hidden");
        document
          .querySelector(".ClaimWinningsArrowDown")
          .classList.remove("hidden");
        break;
      case 2:
        document.querySelector("#WinnerBlockGR").classList.add("Winner2TextGR");
        break;
    }
  }

  function setPlayerHashGameResult(player = 1, hashLetters, hashDigits) {
    switch (player) {
      case 1:
        document.querySelector(".Player1HashGR p").innerHTML =
          hashLetters + "<br/>" + hashDigits;
        break;
      case 2:
        document.querySelector(".Player2HashGR p").innerHTML =
          hashLetters + "<br/>" + hashDigits;
        break;
    }
  }

  function offerSelect() {
    console.log(selectedLobby);
    console.log(selectedOfferNft);
    AcceptOffer(
      selectedLobby.lobby.lobbyId,
      selectedOfferNft.id,
      Moralis,
      (isSign, json) => {
        if (isSign) {
          showGameResultsCreator();
        }
      },
    );
  }

  function claimWinning() {
    let lobbyId;
    if (window.isCreate) {
      lobbyId = selectedLobby.lobby.lobbyId;
    } else {
      lobbyId = selectedLobby.id;
    }
    console.log(selectedLobby);
    ClaimReward(lobbyId, Moralis, (isSign, json) => {
      if (isSign) {
        window.location.reload();
      }
    });
  }

  function rotate() {
    var red = document
      .querySelector("#CoinFlip")
      .style.setProperty(
        "--animation-time",
        (Math.floor(Math.random() * 10) * 180 + 180 * 15).toString() + "deg",
      );
    document
      .querySelector("#CoinFlip")
      .classList.toggle("flip-container-hover");
  }

  function setDataInTopBlock(position, gameblock) {
    document.querySelector("#positionTBGR").innerHTML = position;
    document.querySelector("#gameBlockTBGR").innerHTML = gameblock;
  }

  function setDataInBottomBlock(hash) {
    document.querySelector(".GameHashBBGR").innerHTML = hash;
  }

  function test() {
    let hash = "0x000009080706050f0e0d";

    let oHashLetters = "";
    let oHashDigits = "";

    for (let i in hash) {
      if (i <= 5) continue;

      let letter = hash[i];
      if (letter === "d" && letter !== "0" && letter >= "1" && letter <= "9")
        oHashDigits +=
          '<span class="yellowForHash">' + letter + "</span>" + " ";
      else if (letter !== "0" && letter >= "1" && letter <= "9")
        oHashDigits += letter + " ";
      else if (letter !== "0" && letter === "d")
        oHashLetters +=
          '<span class="yellowForHash">' + letter + "</span>" + " ";
      else if (letter !== "0") oHashLetters += letter + " ";
    }

    к(1, oHashLetters, oHashDigits);
  }

  return (
    <div className="background">
      <img className="gameIcon" src={gameIcon} onClick={() => rotate()} />
      <div className="GameWindow1 hidden">
        <img className="coin coinWork" src={coinMain} />
        <p id="statusBlock">Select NFT you want to play for</p>
        <div className="line1" />
        <div className="selectedNft">
          <input type="hidden" id="tokenAddress" value="" />
          <input type="hidden" id="tokenID" value="" />
          <input type="hidden" id="tokenImage" value="" />
          <input type="hidden" id="tokenName" value="" />
          <input type="hidden" id="selectedOffer" value="" />
        </div>
        <div className="offersContainer">
          <Scrollable _class="ScrollableOffers">
            {offers != null &&
              offers.map((el, index) => {
                return (
                  <div
                    className="offerItem"
                    key={index}
                    id={"offer-id" + index.toString()}
                    onClick={() => selectOffer(el, index)}
                  >
                    <img src={el?.nftTransfer.tokenImage || notFoundNft} />
                    <p className="offerNftName">{el?.nftTransfer.tokenName}</p>
                    <div className="bottomOfferBlock">
                      <p className="bottomOfferBlockItem">TAILS</p>
                      <p className="bottomOfferBlockNickname">
                        {el?.UserID.toString().slice(0, 2) +
                          "..." +
                          el?.UserID.toString().slice(-6)}
                      </p>
                    </div>
                  </div>
                );
              })}
          </Scrollable>
        </div>
        <div className="nftsContainer">
          <Scrollable _class="ScrollableNft">
            <Skeleton loading={!NFTBalances?.result}>
              {NFTBalances?.result &&
                NFTBalances.result.map((nft, index) => {
                  nft = verifyMetadata(nft);
                  return (
                    <div
                      className="NftItem"
                      id={"nft-id" + index.toString()}
                      onClick={() => selectNft(nft, index)}
                      key={index}
                    >
                      <img src={nft?.image || notFoundNft} />
                    </div>
                  );
                })}
            </Skeleton>
          </Scrollable>
        </div>
        <div className="line2" />
        <input type="button" id="play" value="Play" onClick={addOffer} />
      </div>
      <div className="GameWindowStart">
        <div>
          <img className="coin" src={coinMain} />
          <CustomAuth />
        </div>
        <input
          type="button"
          value="CREATE GAME"
          className="CreateGameButton"
          onClick={() => createGame()}
        />
        <input
          type="button"
          value="FIND GAME"
          className="FindGameButton"
          onClick={() => findGame()}
        />
      </div>
      <div className="WaitGameStart hidden">
        <div>
          <img className="coin coinWork" src={coinMain} />
        </div>
        <p id="statusBlock">Just wait...</p>
        <div className="NftNotSelected hidden">
          <p>Your game offer was not selected</p>
        </div>
        <div className="Player1BlockWait">
          <p className="PlayerBlockWaitText">Player 1</p>
          <img className="PlayerBlockWaitImage" id="PlayerBlockWaitImage1" />
        </div>
        <div className="Player2BlockWait">
          <p className="PlayerBlockWaitText">Player 2</p>
          <img className="PlayerBlockWaitImage" id="PlayerBlockWaitImage2" />
        </div>
        <p className="VsTextOnBlockWait">VS</p>
        <input
          type="button"
          value="Cancel Game Offer"
          className="CancelOfferBlockWait"
          onClick={() => cancelOffer()}
        />
      </div>
      <div className="GameResults hidden">
        <div className="TopBlockGR">
          <img src={topBlockGR} />
          <div className="CurrentBlockTBGR">
            <span>Current block: </span>{" "}
            <span id="currentBlockTBGR" style={{ color: "#F7931E" }}></span>
          </div>
          <div className="PositionTBGR">
            <span>Position: </span>{" "}
            <span id="positionTBGR" style={{ color: "#F7931E" }}></span>
          </div>
          <div className="GameBlockTBGR">
            <span>Game block: </span>{" "}
            <span id="gameBlockTBGR" style={{ color: "#F7931E" }}></span>
          </div>
        </div>
        <img src={coinBackgroundGR} className="CoinBackgroundGR" />
        <div className="CoinDiv">
          <div className="flip-container vertical" id="CoinFlip">
            <div className="flipper">
              <div className="front">
                <img src={FontCoin} />
              </div>
              <div className="back">
                <img src={BackCoin} />
              </div>
            </div>
          </div>
        </div>
        <div className="Player1CardGR">
          <p className="PlayerTextGR">Player 1</p>
          <img className="PlayerImageGR" id="Player1ImgGR" />
        </div>
        <div className="Player2CardGR">
          <p className="PlayerTextGR">Player 2</p>
          <img className="PlayerImageGR" id="Player2ImgGR" />
        </div>
        <div className="BottomBlockGR">
          <img src={topBlockGR} />
          <div className="GameHashBBGR"></div>
        </div>
        <div className="Player1HashGR">
          <p></p>
        </div>
        <div className="Player1ArrowDown" />
        <div className="Player2ArrowDown" />
        <div className="Player2HashGR">
          <p></p>
        </div>
        <p className="hidden" id="WinnerBlockGR">
          WINNER
        </p>
        <div className="ClaimWinningsArrowDown hidden" />
        <input
          type="button"
          className="ClaimWinningsGR hidden"
          value="claim winnings"
          onClick={() => claimWinning()}
        />
      </div>
    </div>
  );
}
