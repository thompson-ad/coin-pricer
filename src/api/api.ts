import { Asset } from "../core/Asset";
import { ICoin } from "../core/Coins";
import { client } from "./client";

export interface Price {
  price: string;
  timestamp: string;
}

export type AsyncStatus = "IDLE" | "PENDING" | "RESOlVED" | "REJECTED";

export const fetchSupportedCoins = (): Promise<ICoin[]> => {
  return client("get-coins", { method: "GET" });
};

export const fetchCoinPrice = (
  source: Asset,
  destination: Asset
): Promise<Price> => {
  return client(
    `get-coin-price?destinationCoin=${destination}&sourceCoin=${source}`,
    {
      method: "GET",
    }
  );
};
