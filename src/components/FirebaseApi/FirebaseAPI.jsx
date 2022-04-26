/* eslint-disable */
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, onValue, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD-QqxBGWTquYLsdJb37S5MuYJiuaV3c58",
  authDomain: "gameq-ec6f4.firebaseapp.com",
  projectId: "gameq-ec6f4",
  storageBucket: "gameq-ec6f4.appspot.com",
  messagingSenderId: "723359385931",
  appId: "1:723359385931:web:7e0971cf5f55ac078b00ce",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export function setOnValueChanged(id, callback) {
  const startCouruntine = ref(database, "Lobbies/" + id + "/");
  onValue(startCouruntine, (snapshot) => {
    callback(snapshot.val());
  });
}

export function setValue(
  player,
  userID,
  nft_address,
  nft_id,
  id = null,
  nft_image,
  callback = null,
) {
  if (id == null) {
    var id = "id" + Math.random().toString(16).slice(2);
    window.gameId = id;
  }
  set(ref(database, "Lobbies/" + id + "/player-" + player), {
    nftTransfer: {
      tokenID: nft_id,
      tokenAddress: nft_address,
      tokenImage: nft_image,
    },
    UserID: userID,
  });
  if (callback != null) {
    setOnValueChanged(id, callback);
  }
}

export function connectToLobby(id, userID, nft_address, nft_id, nft_image, callback = null) {
  setValue("2", userID, nft_address, nft_id, id, nft_image);
  if (callback != null) {
      setOnValueChanged(id, callback)
  }
  return true;
}

export function searchLobby(json, callback) {
  for (let x in json) {
    if (json[x].hasOwnProperty("player-2")) continue;
    else {
      callback(x, json[x]);
      return;
    }
  }
  callback(null, null);
}

export function getValue(callback) {
  get(child(ref(database), "Lobbies/")).then((snapshot) => {
    if (snapshot.exists()) {
      searchLobby(snapshot.val(), callback);
    } else {
      callback(null, null);
    }
  });
}

export function setGameWinner(id, address){
    set(ref(database, "Lobbies/" + id), {
        winner: address
    })
}

export function removeLobbie(id){
    remove(ref(database, "Lobbies/" + id))
}

export function addNftToSearch(address, nftID, nftAddress, nftImage, nftName){
  const id = "id" + Math.random().toString(16).slice(2);
  set(ref(database, "Offers/" + id), {
    nftTransfer: {
      tokenID: nftID,
      tokenAddress: nftAddress,
      tokenImage: nftImage,
      tokenName: nftName,
    },
    UserID: address,
  });
}

export function getAllOffersWithoutMy(address, callback){
  get(child(ref(database), "Offers/")).then((snapshot) => {
      if (snapshot.exists()){
        let offers = []
        let json = snapshot.val()
        for (let offer in json){
          if (json[offer]["UserID"].toString() === address.toString()) continue
          else{
            offers.push(json[offer])
          }
        }
        callback(offers)
        console.log(offers)
      }
  })
}