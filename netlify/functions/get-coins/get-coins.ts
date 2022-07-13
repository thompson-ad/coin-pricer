import { Handler } from "@netlify/functions";
import { fetchSupportedCoin } from "../../api/api";
import supportedCoins from "../../supportedCoins";

export const handler: Handler = async () => {
  try {
    const getCoinPromises = supportedCoins.map((coin) =>
      fetchSupportedCoin(coin).then((responseData) => {
        const coin = responseData.data.coin;
        return {
          uuid: coin.uuid,
          name: coin.name,
          priceInUsd: parseFloat(coin.price).toFixed(2),
          symbol: coin.symbol,
          iconUrl: coin.iconUrl,
        };
      })
    );
    const data = await Promise.all(getCoinPromises);
    return { statusCode: 200, body: JSON.stringify({ data }) };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed fetching data" }),
    };
  }
};
