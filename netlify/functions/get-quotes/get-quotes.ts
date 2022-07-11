import { Handler } from "@netlify/functions";
import fetch from "node-fetch";

const GET_COINS_ENDPOINT =
  "https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0";

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "71d316bab3msh745974fccc4e3fbp14c1b5jsnfc5dff0ed5af",
    "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
  },
};

export const handler: Handler = async (event, context) => {
  try {
    const response = await fetch(GET_COINS_ENDPOINT, options);
    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify({ data }) };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed fetching data" }),
    };
  }
};
