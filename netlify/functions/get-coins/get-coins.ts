import { Handler } from "@netlify/functions";
import fetch from "node-fetch";
import supportedCoins from "../supportedCoins";

// Find information about a specific coin
// GET /coin/:uuid
// ?referenceCurrencyUuid default to US dollar: yhjMzLPhuIDl
const GET_COIN_ENDPOINT = "https://coinranking1.p.rapidapi.com/coin";

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "71d316bab3msh745974fccc4e3fbp14c1b5jsnfc5dff0ed5af",
    "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
  },
};

export const handler: Handler = async (event, context) => {
  try {
    const getCoinPromises = supportedCoins.map((coin) =>
      fetch(`${GET_COIN_ENDPOINT}/${coin}`, options)
        .then((response) => response.json())
        .then((responseData) => {
          const coin = responseData.data.coin;
          return {
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
