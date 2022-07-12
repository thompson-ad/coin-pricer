import { Handler } from "@netlify/functions";
import fetch from "node-fetch";

// Get price for a specific coin
// GET /coin/:uuid
// destination = ?referenceCurrencyUuid default to US dollar: yhjMzLPhuIDl
const GET_COIN_ENDPOINT = "https://coinranking1.p.rapidapi.com/coin";

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "71d316bab3msh745974fccc4e3fbp14c1b5jsnfc5dff0ed5af",
    "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
  },
};

export const handler: Handler = async (event, context) => {
  // Only allow GET
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  const destinationCoin = event.queryStringParameters?.destinationCoin;
  const sourceCoin = event.queryStringParameters?.sourceCoin;
  try {
    const GET_COIN_PRICE_ENDPOINT = `${GET_COIN_ENDPOINT}/${destinationCoin}/price?referenceCurrencyUuid=${sourceCoin}`;
    const response = await fetch(GET_COIN_PRICE_ENDPOINT, options);
    const responseData = await response.json();
    const data = responseData.data;

    return { statusCode: 200, body: JSON.stringify({ data }) };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed fetching data" }),
    };
  }
};
