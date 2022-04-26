/* eslint-disable */
import NFTtoChoose from "./LobbyObjects/NFTtoChoose";
import ReactDOM from "react-dom";
import { useMoralis, useNFTBalances } from "react-moralis";
import mainStyle from "./game.css"
import coinMain from "coin2.png"
import gameIcon from "gameIcon.png"
import notFoundNft from "notFoundNft.jpg"
import Scrollable from "./Scrollable"
import { useVerifyMetadata } from "../hooks/useVerifyMetadata";
import { Skeleton } from "antd";
import { addNftToSearch, getAllOffersWithoutMy } from "./FirebaseApi/FirebaseAPI";
import { useState } from "react";


export default function Game(){
  const { account, isAuthenticated, Moralis, chainId } = useMoralis();
  const [ offers, setOffers ] = useState( []);
  const { data: NFTBalances } = useNFTBalances();
  const { verifyMetadata } = useVerifyMetadata();

  const allNftItems = [...document.querySelectorAll(".NftItem")]

  function selectNft(nft, index) {

      allNftItems.map((el) => {
          el.classList.remove("NftItemSelected")
      })

      document.getElementById("nft-id"+index.toString()).classList.add("NftItemSelected")
      document.querySelector(".line1").classList.add("line1SelectedNft")
      document.querySelector(".line2").classList.add("line2SelectedNft")

      document.getElementById("tokenAddress").value = nft.token_address;
      document.getElementById("tokenID").value = nft.token_id;
      document.getElementById("tokenImage").value = nft.image;
      document.getElementById("tokenName").value = nft.metadata.name != null ? nft.metadata.name : "null";
  }

  function addOffer(){
    if (!window.isOffersShow){

      const tokenAddress = document.getElementById("tokenAddress").value;
      const tokenID = document.getElementById("tokenID").value;
      const tokenImage = document.getElementById("tokenImage").value;
      const tokenName = document.getElementById("tokenName").value;

      document.querySelector(".nftsContainer").classList.add("hidden");
      document.querySelector(".line1").classList.add("line1SelectedNft2");
      document.querySelector(".line2").classList.add("line2SelectedNft2");


      getAllOffersWithoutMy(account, (offers) => {
        setOffers(offers)
        document.getElementById("statusBlock").innerHTML = "Select game offer"
        document.getElementById("play").value = "Start game"
        window.isOffersShow = true;
      });

      //addNftToSearch(account, tokenID, tokenAddress, tokenImage, tokenName)

    }
    else {
      console.log("TRUE")
    }

  }

  return (<div className="background">
    <img className="coin" src={coinMain}/>
    <img className="gameIcon" src={gameIcon}/>
    <p id="statusBlock">Select NFT you want to play for</p>
    <div className="line1"/>
    <div className="selectedNft">
      <input type="hidden" id="tokenAddress" value="" />
      <input type="hidden" id="tokenID" value="" />
      <input type="hidden" id="tokenImage" value="" />
      <input type="hidden" id="tokenName" value="" />
    </div>
    <div className="offersContainer">
      <Scrollable _class="ScrollableOffers">
          {offers != null && offers.map((el, index) => {
            return (<div className="offerItem" key={index} id={"offer-id"+index.toString()}>
              <img src={el?.nftTransfer.tokenImage || notFoundNft} />
              <p className="offerNftName">{el?.nftTransfer.tokenName}</p>
            </div>)
          })}
      </Scrollable>
    </div>
    <div className="nftsContainer">
      <Scrollable _class="ScrollableNft">
        <Skeleton loading={!NFTBalances?.result}>
        {NFTBalances?.result &&
          NFTBalances.result.map((nft, index) => {
            nft = verifyMetadata(nft);
            return (<div className="NftItem" id={"nft-id"+index.toString()} onClick={() => selectNft(nft, index)} key={index}>
              <img src={nft?.image || notFoundNft} />
            </div>)

          })}
        </Skeleton>
      </Scrollable>
    </div>
    <div className="line2"/>
    <input
      type="button"
      id="play"
      value="Play"
      onClick={addOffer}
    />
  </div>);

}