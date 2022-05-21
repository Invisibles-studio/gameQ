/* eslint-disable */
import { useMoralis } from "react-moralis";

const contract = process.env.REACT_APP_CONTRACT_HASH;
console.log(contract);

// получить разрешение на контракт
export function GetApproval(nft, Moralis, callback) {
  console.log(nft);

  const options = {
    contractAddress: nft?.token_address,
    functionName: "setApprovalForAll",
    abi: ABI_ERC721,
    params: {
      operator: contract.toLowerCase(),
      _approved: true,
    },
  };
  ExecFunc(options, Moralis).then(({ isSigned, value }) => {
    let isS = isSigned;
    if (isS === false) {
      callback(false, null);
      return;
    }
    let val = {
      owner: value["events"][0]["args"]["owner"],
      operator: value["events"][0]["args"]["operator"],
      bApproved: value["events"][0]["args"]["approved"],
    };
    console.log(val);
    callback(isS, val);
  });
}

export function CheckApproval(nft, _owner, Moralis, callback) {
  console.log(nft);

  const options = {
    contractAddress: nft?.token_address,
    functionName: "isApprovedForAll",
    abi: ABI_ERC721,
    params: {
      owner: _owner,
      operator: contract.toLowerCase(),
    },
  };
  ExecReadFunc(options, Moralis).then((val) => {
    if (val === "error") {
      callback(null);
      return;
    }
    console.log(val);
    callback(val);
  });
}

export async function GetBlock(Web3Api, _chain) {
  const options = { chain: _chain, date: Date.now() };
  const date = await Web3Api.native.getDateToBlock(options);
  return date.block;
}

//создать игровое лобби
export function CreateLobby(nft, etherValue = 0, Moralis, callback) {
  console.log(nft);

  const options = {
    contractAddress: contract.toLowerCase(),
    functionName: "CreateLobby",
    abi: ABI_GAME,
    params: {
      _creatorNFT: nft?.token_address,
      _creatorNFTId: nft?.token_id,
      _creatorEtherValue: etherValue,
    },
    msgValue: etherValue.toString(),
  };
  let isS = null;
  let val = null;
  ExecFunc(options, Moralis).then(({ isSigned, value }) => {
    isS = isSigned;
    if (isS === false) {
      callback(false, null);
      return;
    }
    val = {
      lobby: {
        lobbyId: parseInt(value["events"][2]["args"]["lobbyId"]._hex, 16),
        creator: value["events"][2]["args"]["creator"],
        creatorBet: parseInt(value["events"][2]["args"]["creatorBet"]._hex, 16),
      },
      bet: {
        NFTAddress: value["events"][3]["args"]["NFTAddress"],
        NFTId: parseInt(value["events"][3]["args"]["NFTId"]._hex, 16),
        betId: parseInt(value["events"][3]["args"]["betId"]._hex, 16),
        etherValue: parseInt(value["events"][3]["args"]["etherValue"]._hex, 16),
        lobbyId: parseInt(value["events"][3]["args"]["lobbyId"]._hex, 16),
        user: value["events"][3]["args"]["user"],
      },
    };
    console.log(val);
    callback(isS, val);
  });
  return 1;
}

//предложить играть в контректном лобби
export function CreateOffer(lobbyID, nft, etherValue = 0, Moralis, callback) {
  console.log(nft);
  const options = {
    contractAddress: contract.toLowerCase(),
    functionName: "CreateOffer",
    abi: ABI_GAME,
    params: {
      lobbyId: lobbyID,
      _userNFT: nft?.token_address,
      _userNFTId: nft?.token_id,
      _userEtherValue: etherValue,
    },
  };
  let isS = null;
  let val = null;
  ExecFunc(options, Moralis).then(({ isSigned, value }) => {
    isS = isSigned;
    if (isS === false) {
      callback(false, null);
      return;
    }
    val = {
      bet: {
        NFTAddress: value["events"][2]["args"]["NFTAddress"],
        NFTId: parseInt(value["events"][2]["args"]["NFTId"]._hex, 16),
        betId: parseInt(value["events"][2]["args"]["betId"]._hex, 16),
        etherValue: parseInt(value["events"][2]["args"]["etherValue"]._hex, 16),
        lobbyId: parseInt(value["events"][2]["args"]["lobbyId"]._hex, 16),
        user: value["events"][2]["args"]["user"],
      },
    };
    console.log(val);
    callback(isS, val);
  });
}

//отменить предложение игры
export function WithdrawOffer(betID, Moralis, callback) {
  const options = {
    contractAddress: contract.toLowerCase(),
    functionName: "WithdrawOffer",
    abi: ABI_GAME,
    params: {
      betId: betID,
    },
  };

  ExecFunc(options, Moralis).then(({ isSigned, value }) => {
    let isS = isSigned;
    if (isS === false) {
      callback(false, null);
      return;
    }
    let val = {
      bet: {
        betId: parseInt(value["events"][2]["args"]["betId"]._hex, 16),
        lobbyId: parseInt(value["events"][2]["args"]["lobbyId"]._hex, 16),
        user: value["events"][2]["args"]["user"],
      },
    };
    console.log(val);
    callback(isS, val);
  });
}

//Принять предложение игры
export function AcceptOffer(lobbyID, betID, Moralis, callback) {
  const options = {
    contractAddress: contract.toLowerCase(),
    functionName: "SelectOffer",
    abi: ABI_GAME,
    params: {
      lobbyId: lobbyID,
      betId: betID,
    },
  };
  ExecFunc(options, Moralis).then(({ isSigned, value }) => {
    let isS = isSigned;
    if (isS === false) {
      callback(false, null);
      return;
    }
    let val = {
      bet: {
        NFTAddress: value["events"][0]["args"]["NFTAddress"],
        NFTId: parseInt(value["events"][0]["args"]["NFTId"]._hex, 16),
        betId: parseInt(value["events"][0]["args"]["betId"]._hex, 16),
        etherValue: parseInt(value["events"][0]["args"]["etherValue"]._hex, 16),
        lobbyId: parseInt(value["events"][0]["args"]["lobbyId"]._hex, 16),
        user: value["events"][0]["args"]["user"],
      },
    };
    console.log(val);
    callback(isS, val);
  });
}

// view функция. Не нужно подтверждение на метамаске
export function GetWinner(lobbyID, Moralis, callback) {
  const options = {
    contractAddress: contract.toLowerCase(),
    functionName: "getWinner",
    abi: ABI_GAME,
    params: {
      lobbyId: lobbyID,
    },
  };
  ExecReadFunc(options, Moralis).then((val) => {
    if (val === "error") {
      callback(null);
      return;
    }

    console.log(val);
    let json = {
      winner: val[0],
      address: val[1].toString(),
      blockHash: val[2].toString(),
      index: parseInt(val[3]._hex, 16) + 2,
    };
    callback(json);
  });
}

// забрать выигрыш.
export function ClaimReward(lobbyID, Moralis, callback) {
  const options = {
    contractAddress: contract.toLowerCase(),
    functionName: "claimReward",
    abi: ABI_GAME,
    params: {
      lobbyId: lobbyID,
    },
  };
  ExecFunc(options, Moralis).then(({ isSigned, value }) => {
    let isS = isSigned;
    if (isS === false) {
      callback(false, null);
      return;
    }
    let val = {
      bet: {
        winner: value["events"][4]["args"]["winner"],
        winnerAddress: value["events"][4]["args"]["winnerAddress"],
        etherValue: parseInt(value["events"][4]["args"]["etherValue"]._hex, 16),
        lobbyId: parseInt(value["events"][4]["args"]["lobbyId"]._hex, 16),
      },
    };
    console.log(val);
    callback(isS, val);
  });
}

export function GetActiveLobbies(Moralis, callback) {
  const options = {
    contractAddress: contract.toLowerCase(),
    functionName: "getActiveLobbies",
    abi: ABI_GAME,
  };
  ExecReadFunc(options, Moralis).then((value) => {
    if (value === "error") {
      callback(null);
      return;
    }

    var val = [];
    value = value[1];
    value.forEach(function (res) {
      val.push({
        betCount: parseInt(res["betCount"]._hex, 16),
        blockNumber: parseInt(res["blockNumber"]._hex, 16),
        creator: res["creator"],
        creatorBet: parseInt(res["creatorBet"]._hex, 16),
        creatorHash: res["creatorHash"],
        gameNumber: parseInt(res["gameNumber"]._hex, 16),
        lobbyId: parseInt(res["lobbyId"]._hex, 16),
        lobbyStatus: res["lobbyStatus"],
        opponentBet: parseInt(res["opponentBet"]._hex, 16),
        opponentHash: res["opponentHash"],
        winner: res["winner"],
      });
    });

    console.log(val);
    callback(val);
  });
}

//получает все ставки в конкретном лобби (возвращает )
export function GetBetsInLobby(lobbyID, Moralis, callback) {
  const options = {
    contractAddress: contract.toLowerCase(),
    functionName: "getBetsOfLobby",
    abi: ABI_GAME,
    params: {
      LobbyId: lobbyID,
    },
  };
  ExecReadFunc(options, Moralis).then((value) => {
    if (value === "error") {
      callback(null);
      return;
    }
    var val = [];
    value = value[1];
    value.forEach(function (res) {
      val.push({
        NFT: res["NFT"],
        NFTId: parseInt(res["NFTId"]._hex, 16),
        etherValue: parseInt(res["etherValue"]._hex, 16),
        isCancelled: res["isCancelled"],
        lobbyId: parseInt(res["lobbyId"]._hex, 16),
        user: res["user"],
        betId: parseInt(res["betId"]._hex, 16),
      });
    });
    //console.log(val);
    callback(val);
  });
}

export function GetLobbyById(lobbyID, Moralis, callback) {
  const options = {
    contractAddress: contract.toLowerCase(),
    functionName: "lobbies",
    abi: ABI_GAME,
    params: {
      "": lobbyID,
    },
  };
  ExecReadFunc(options, Moralis).then((res) => {
    if (res === "error") {
      callback(null);
      return;
    }
    var val = {
      betCount: parseInt(res["betCount"]._hex, 16),
      blockNumber: parseInt(res["blockNumber"]._hex, 16),
      creator: res["creator"],
      creatorBet: parseInt(res["creatorBet"]._hex, 16),
      creatorHash: res["creatorHash"],
      gameNumber: parseInt(res["gameNumber"]._hex, 16),
      lobbyId: parseInt(res["lobbyId"]._hex, 16),
      lobbyStatus: res["lobbyStatus"],
      opponentBet: parseInt(res["opponentBet"]._hex, 16),
      opponentHash: res["opponentHash"],
      winner: res["winner"],
      opponent: res["opponent"],
    };
    //console.log(val);
    callback(val);
  });
}
export function GetBetById(betID, Moralis, callback) {
  const options = {
    contractAddress: contract.toLowerCase(),
    functionName: "bets",
    abi: ABI_GAME,
    params: {
      "": betID,
    },
  };
  ExecReadFunc(options, Moralis).then((res) => {
    if (res === "error") {
      callback(null);
      return;
    }
    var val = {
      NFT: res["NFT"],
      NFTId: parseInt(res["NFTId"]._hex, 16),
      etherValue: parseInt(res["etherValue"]._hex, 16),
      isCancelled: res["isCancelled"],
      lobbyId: parseInt(res["lobbyId"]._hex, 16),
      user: res["user"],
    };
    console.log(val);
    callback(val);
  });
}
//------------------------------------------------------
export async function ExecFunc(options, Moralis) {
  try {
    const trn = await Moralis.executeFunction(options);
    console.log(trn);
    const reciept = await trn.wait(1);
    console.log(reciept);
    return { isSigned: true, value: reciept };
  } catch (e) {
    console.log(e);
    return { isSigned: false, value: null };
  }
}

async function ExecReadFunc(options, Moralis) {
  try {
    const trn = await Moralis.executeFunction(options);
    return trn;
  } catch (e) {
    console.log(e);
    return "error";
  }
}
//----------------------------------------------------------------------

export function getNftMetadata(address, id, Moralis, callback) {
  const options = {
    contractAddress: address,
    functionName: "tokenURI",
    abi: ABI_IERC721,
    params: {
      tokenId: id,
    },
  };
  ExecReadFunc(options, Moralis).then((val) => {
    if (val === "error") {
      callback(null);
      return;
    }
    callback(val);
  });
}

const ABI_GAME = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lobbyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "betId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "BetCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lobbyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "betId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "NFTAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "NFTId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "etherValue",
        type: "uint256",
      },
    ],
    name: "BetPlaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lobbyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "betId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "NFTAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "NFTId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "etherValue",
        type: "uint256",
      },
    ],
    name: "BetSelected",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "lobbyId",
        type: "uint256",
      },
    ],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_creatorNFT",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_creatorNFTId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_creatorEtherValue",
        type: "uint256",
      },
    ],
    name: "CreateLobby",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "lobbyId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_userNFT",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_userNFTId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_userEtherValue",
        type: "uint256",
      },
    ],
    name: "CreateOffer",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lobbyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "creatorBet",
        type: "uint256",
      },
    ],
    name: "LobbyCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lobbyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum NFTGame.GameWinner",
        name: "winner",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "winnerAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "etherValue",
        type: "uint256",
      },
    ],
    name: "RewardClaimed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "lobbyId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "betId",
        type: "uint256",
      },
    ],
    name: "SelectOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "betId",
        type: "uint256",
      },
    ],
    name: "WithdrawOffer",
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
        name: "lobbyId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "betId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "NFT",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "NFTId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "etherValue",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isCancelled",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getActiveLobbies",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "lobbyId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "creatorBet",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "opponent",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "opponentBet",
            type: "uint256",
          },
          {
            internalType: "bytes10",
            name: "creatorHash",
            type: "bytes10",
          },
          {
            internalType: "bytes10",
            name: "opponentHash",
            type: "bytes10",
          },
          {
            internalType: "enum NFTGame.LobbyStatus",
            name: "lobbyStatus",
            type: "uint8",
          },
          {
            internalType: "enum NFTGame.GameWinner",
            name: "winner",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "gameNumber",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "blockNumber",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "betCount",
            type: "uint256",
          },
        ],
        internalType: "struct NFTGame.Lobby[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "LobbyId",
        type: "uint256",
      },
    ],
    name: "getBetsOfLobby",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "lobbyId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "betId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "address",
            name: "NFT",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "NFTId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "etherValue",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isCancelled",
            type: "bool",
          },
        ],
        internalType: "struct NFTGame.Bet[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHashes",
    outputs: [
      {
        internalType: "bytes10",
        name: "creatorHash",
        type: "bytes10",
      },
      {
        internalType: "bytes10",
        name: "opponentHash",
        type: "bytes10",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "lobbyId",
        type: "uint256",
      },
    ],
    name: "getWinner",
    outputs: [
      {
        internalType: "enum NFTGame.GameWinner",
        name: "",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "blockHash",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "gameNumber",
        type: "uint256",
      },
    ],
    stateMutability: "view",
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
    name: "lobbies",
    outputs: [
      {
        internalType: "uint256",
        name: "lobbyId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "creatorBet",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "opponent",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "opponentBet",
        type: "uint256",
      },
      {
        internalType: "bytes10",
        name: "creatorHash",
        type: "bytes10",
      },
      {
        internalType: "bytes10",
        name: "opponentHash",
        type: "bytes10",
      },
      {
        internalType: "enum NFTGame.LobbyStatus",
        name: "lobbyStatus",
        type: "uint8",
      },
      {
        internalType: "enum NFTGame.GameWinner",
        name: "winner",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "gameNumber",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "betCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const ABI_ERC721 = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const ABI_IERC721 = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
