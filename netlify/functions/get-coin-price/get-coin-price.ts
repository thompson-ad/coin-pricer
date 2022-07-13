import { Handler } from "@netlify/functions";
import { fetchCoinPrice } from "../../api/api";

export const handler: Handler = async (event) => {
  // Only allow GET
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  const destinationCoin = event.queryStringParameters?.destinationCoin;
  const sourceCoin = event.queryStringParameters?.sourceCoin;

  // Ensure FE sends params
  if (!destinationCoin && !sourceCoin) {
    return {
      statusCode: 400,
      body: "Please include destination and source coin uuid",
    };
  }

  try {
    const data = await fetchCoinPrice(destinationCoin, sourceCoin);
    return { statusCode: 200, body: JSON.stringify({ data }) };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed fetching data" }),
    };
  }
};
