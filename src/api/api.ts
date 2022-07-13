import { Asset } from "../core/Asset";
import { ICoin } from "../core/Coins";
import { client } from "./client";

export interface PriceReponse {
  status: string;
  data: {
    price: string;
    timestamp: number;
  };
}

export const fetchSupportedCoins = (): Promise<ICoin[]> => {
  return client("get-coins");
};

export const fetchCoinPrice = (
  source: Asset,
  destination: Asset
): Promise<PriceReponse> => {
  return client(
    `get-coin-price?destinationCoin=${destination}&sourceCoin=${source}`
  );
};
