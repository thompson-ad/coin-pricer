import "./reset.css";
import "./index.css";
import { useCallback, useEffect, useState } from "react";
import useInterval from "./useInterval";
import { Coin, CoinPriceList } from "./components/CoinPriceList";
import { AccountList } from "./components/AccountList";
import { Exchange } from "./components/Exchange";
import Bank from "./core/Bank";
import Observable from "./core/TradeObservable";

const FETCH_COINS_INTERVAL = 30000;

function App() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [accountData, setAccountData] = useState<Coin[]>([]);

  useInterval(
    () => {
      fetchSupportedCoins()
        .then((coins) => {
          setCoins(coins);
        })
        .catch((err) => console.error("ERROR", err));
    },
    FETCH_COINS_INTERVAL,
    true
  );

  const onAccountsChanged = useCallback(() => {
    const accounts = coins.filter((coin) => Bank.balances.has(coin.uuid));
    setAccountData(accounts);
  }, [coins]);

  useEffect(() => {
    onAccountsChanged();
    Observable.subscribe(onAccountsChanged);

    return () => Observable.unsubscribe(onAccountsChanged);
  }, [onAccountsChanged]);

  const fetchSupportedCoins = () => {
    return fetch("/.netlify/functions/get-coins").then(async (response) => {
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

  if (!coins.length) {
    return <h2>Loading</h2>;
  }

  return (
    <div>
      <h2>Prices</h2>
      <CoinPriceList coins={coins} />
      <h2>Your Accounts</h2>
      <AccountList accounts={accountData} />
      <h2>Exchange</h2>
      <Exchange coins={coins} />
    </div>
  );
}

export default App;
