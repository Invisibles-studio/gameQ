/* eslint-disable */
import { useMoralis } from "react-moralis";

const { Moralis } = useMoralis();

const contract = "0x5cB4F850f90339151a2AbFC23Ba4B0E902261974";

// получить разрешение на контракт
export function getApproval() {
  const nft = window.chosenNFT;
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
  return execFunc(options);
}

//создать игровое лобби
export function CreateLobby(nft = window.chosenNFT, etherValue = 0) {
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
  };
  return execFunc(options);
}

//предложить играть в контректном лобби
export function CreateOffer(lobbyID, nft = window.chosenNFT, etherValue = 0) {
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
  return execFunc(options);
}

//отменить предложение игры
export function WithdrawOffer(betID) {
  console.log(nft);

  const options = {
    contractAddress: contract.toLowerCase(),
    functionName: "WithdrawOffer",
    abi: ABI_GAME,
    params: {
      betId: betID,
    },
  };
  return execFunc(options);
}

//Принять предложение игры
export function AcceptOffer(lobbyID, betID) {
  console.log(nft);

  const options = {
    contractAddress: contract.toLowerCase(),
    functionName: "SelectOffer",
    abi: ABI_GAME,
    params: {
      lobbyId: lobbyID,
      betId: betID,
    },
  };
  return execFunc(options);
}

// view функция. Не нужно подтверждение на метамаске
export function getWinner(lobbyID) {
  console.log(nft);

  const options = {
    contractAddress: contract.toLowerCase(),
    functionName: "getWinner",
    abi: ABI_GAME,
    params: {
      lobbyId: lobbyID,
    },
  };
  return execFunc(options);
}

// забрать выигрыш.
export function ClaimReward(lobbyID) {
  console.log(nft);

  const options = {
    contractAddress: contract.toLowerCase(),
    functionName: "claimReward",
    abi: ABI_GAME,
    params: {
      lobbyId: lobbyID,
    },
  };
  return execFunc(options);
}

export function getActiveLobbies() {
  console.log(nft);

  const options = {
    contractAddress: contract.toLowerCase(),
    functionName: "getActiveLobbies",
    abi: ABI_GAME,
  };
  return execFunc(options);
}

//получает все ставки в конкретном лобби (возвращает )
export function getBetsInLobby(lobbyID) {
  console.log(nft);

  const options = {
    contractAddress: contract.toLowerCase(),
    functionName: "getBetsOfLobby",
    abi: ABI_GAME,
    params: {
      LobbyId: lobbyID,
    },
  };
  return execFunc(options);
}

//------------------------------------------------------
export async function execFunc(options) {
  try {
    const trn = await Moralis.executeFunction(options);
    const reciept = await trn.wait(3);
    console.log(reciept);
    return { isSigned: true, value: reciept };
  } catch (e) {
    console.log(e);
    return false;
  }
}
//----------------------------------------------------------------------

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
