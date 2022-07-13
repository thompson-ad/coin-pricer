import { SupportedCoins } from "../supportedCoins";
import { client } from "./client";

export const fetchSupportedCoin = (coin: SupportedCoins): Promise<any> => {
  return client(`${coin}`);
};

export const fetchCoinPrice = (
  destinationCoin?: string,
  sourceCoin?: string
): Promise<any> => {
  return client(`${destinationCoin}/price?referenceCurrencyUuid=${sourceCoin}`);
};
