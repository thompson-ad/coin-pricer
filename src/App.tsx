import "./reset.css";
import "./index.css";
import { useCallback, useEffect } from "react";
import { CoinPriceList } from "./components/CoinPriceList";
import { AccountList } from "./components/AccountList";
import { Exchange } from "./components/Exchange";
import Coins, { ICoin } from "./core/Coins";
import { useCoinsContext } from "./providers/CoinsProvider";
import { TradeHistory } from "./components/TradeHistory";

const FETCH_COINS_INTERVAL = 15000;

function App() {
  const { coins, addCoins } = useCoinsContext();

  const onCoinsUpdated = useCallback(
    (coins: ICoin[]) => {
      addCoins(coins);
    },
    [addCoins]
  );

  const getCoins = useCallback(async () => {
    const coins = await Coins.getCoins();
    onCoinsUpdated(coins);
  }, [onCoinsUpdated]);

  useEffect(() => {
    getCoins();
    Coins.subscribe(onCoinsUpdated);
    return () => Coins.unsubscribe(onCoinsUpdated);
  }, [addCoins, getCoins, onCoinsUpdated]);

  useEffect(() => {
    Coins.updateCoins(FETCH_COINS_INTERVAL);
    return () => Coins.cleanUpdates();
  }, []);

  if (!coins.length) {
    return <h2>Loading</h2>;
  }

  return (
    <div>
      <h2>Prices</h2>
      <CoinPriceList />
      <h2>Your Accounts</h2>
      <AccountList />
      <h2>Exchange</h2>
      <Exchange />
      <h2>Trade History</h2>
      <TradeHistory />
    </div>
  );
}

export default App;
