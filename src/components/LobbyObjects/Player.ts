import { useMoralis } from "react-moralis";

const { isAuthenticated, account } = useMoralis();

export default class Player {
  nft: object;
  ready: boolean;
  ethAdress: string;
  constructor() {
    if (isAuthenticated) {
      this.ethAdress = account.toLowerCase();
    }
  }

  setNft(nft: object) {
    this.nft = nft;
  }

  setReady(isReady: boolean) {
    this.ready = isReady;
  }
}
