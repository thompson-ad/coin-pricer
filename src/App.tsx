import "./reset.css";
import "./index.css";
import { useState } from "react";
import useInterval from "./useInterval";
import { CoinPriceList } from "./components/CoinPriceList";
import Bank from "./core/Bank";
import AssetExchange from "./core/Exchange";
import { AccountList } from "./components/AccountList";
import { Exchange } from "./components/Exchange";

function App() {
  const [coins, setCoins] = useState([]);

  useInterval(
    () => {
      fetchSupportedCoins()
        .then((coins) => {
          setCoins(coins);
        })
        .catch((err) => console.error("ERROR", err));
    },
    5000,
    false // Ideally this would be set to true but I ran into rate limiting issues with the coinranking API
  );

  // Extract to the core
  const fetchSupportedCoins = () => {
    return window
      .fetch("/.netlify/functions/get-coins")
      .then(async (response) => {
        const { data: coinsData } = await response.json();
        if (response.ok) {
          if (coinsData.length > 0) {
            return coinsData;
          } else {
            return Promise.reject(new Error(`Coin data not available`));
          }
        } else {
          return Promise.reject("Something went wrong");
        }
      });
  };

  return (
    <div>
      <h2>Prices</h2>
      <CoinPriceList coins={coins} />
      {/* Shows available accounts and corresponding balances */}
      {/* The bank gives us a Map of accounts with UUID and balance, how can we show the symbol for the UUID? */}
      <h2>Your Accounts</h2>
      <AccountList coins={coins} />
      <h2>Exchange</h2>
      <Exchange coins={coins} />
    </div>
  );
}

export default App;
