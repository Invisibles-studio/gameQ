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
import { addNftToSearch, getAllOffersWithoutMy, } from "./FirebaseApi/FirebaseAPI";
import { useState } from "react";
import CustomAuth from "components/CustomAuth"

export default function Game() {
  const { account, isAuthenticated, Moralis, chainId } = useMoralis();
  const [offers, setOffers] = useState([]);
  const { data: NFTBalances } = useNFTBalances();
  const { verifyMetadata } = useVerifyMetadata();

  const allNftItems = [...document.querySelectorAll(".NftItem")];
  let isCreate = false

  function selectNft(nft, index) {
    allNftItems.map((el) => {
      el.classList.remove("NftItemSelected");
    });

    document
      .getElementById("nft-id" + index.toString())
      .classList.add("NftItemSelected");
    document.querySelector(".line1").classList.add("line1SelectedNft");
    document.querySelector(".line2").classList.add("line2SelectedNft");

    document.getElementById("tokenAddress").value = nft.token_address;
    document.getElementById("tokenID").value = nft.token_id;
    document.getElementById("tokenImage").value = nft.image;
    document.getElementById("tokenName").value =
      nft.metadata.name != null ? nft.metadata.name : "null";
  }

  function addOffer() {
    if (!window.isOffersShow && isCreate) {
      const tokenAddress = document.getElementById("tokenAddress").value;
      const tokenID = document.getElementById("tokenID").value;
      const tokenImage = document.getElementById("tokenImage").value;
      const tokenName = document.getElementById("tokenName").value;

      document.querySelector(".nftsContainer").classList.add("hidden");
      document.querySelector(".line1").classList.add("line1SelectedNft2");
      document.querySelector(".line2").classList.add("line2SelectedNft2");

      getAllOffersWithoutMy(account, (offers) => {
        setOffers(offers);
        document.getElementById("tokenAddress").value = tokenAddress;
        document.getElementById("tokenID").value = tokenID;
        document.getElementById("tokenImage").value = tokenImage;
        document.getElementById("tokenName").value = tokenName;
        document.getElementById("statusBlock").innerHTML = "Select game offer";
        document.getElementById("play").value = "Start game";
        window.isOffersShow = true;
      });

      //addNftToSearch(account, tokenID, tokenAddress, tokenImage, tokenName)
    } else {
      const offerID = document.getElementById("selectedOffer").value;
      if (offerID != "") {
        console.log("TRUE : " + offerID);
      }
    }
    if(!isCreate){
      const offerID = document.getElementById("selectedOffer").value;
      document.querySelector(".line1").classList.remove("line1SelectedNft2");
      document.querySelector(".line2").classList.remove("line2SelectedNft2");

      document.querySelector(".nftsContainer").classList.remove("hidden");
      setOffers([]);
    }
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
  }

  function createGame(){
    document.querySelector(".GameWindow1").classList.remove("hidden")
    document.querySelector(".GameWindowStart").classList.add("hidden")
    isCreate = true
  }

  function findGame(){
    document.querySelector(".GameWindow1").classList.remove("hidden")
    document.querySelector(".GameWindowStart").classList.add("hidden")

    document.querySelector(".line1").classList.add("line1SelectedNft2");
    document.querySelector(".line2").classList.add("line2SelectedNft2");

    getAllOffersWithoutMy(account, (offers) => {
      setOffers(offers);
      document.getElementById("tokenAddress").value = tokenAddress;
      document.getElementById("tokenID").value = tokenID;
      document.getElementById("tokenImage").value = tokenImage;
      document.getElementById("tokenName").value = tokenName;
      document.getElementById("statusBlock").innerHTML = "Select game offer";
      document.getElementById("play").value = "Start game";
      window.isOffersShow = true;
    });

    document.querySelector(".nftsContainer").classList.add("hidden");
  }

  return (
    <div className="background">
      <img className="gameIcon" src={gameIcon} />
      <div className="GameWindow1 hidden">
        <img className="coin" src={coinMain} />
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
        <input type="button" value="CREATE GAME" className="CreateGameButton" onClick={() => createGame()}/>
        <input type="button" value="FIND GAME" className="FindGameButton" onClick={() => findGame()}/>
      </div>
    </div>
  );
}
