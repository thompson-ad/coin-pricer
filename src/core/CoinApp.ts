import { Bank } from "./Bank";
import { Coins, ICoin } from "./Coins";
import { AssetExchange } from "./Exchange";
import { MyPricer } from "./Pricer";
import { TradeObservable } from "./TradeObservable";

export function getCoinApp() {
  const bank = new Bank();

  const pricer = new MyPricer();
  const assetExchange = new AssetExchange(pricer, bank);

  const tradeObservable = new TradeObservable();
  const coins = new Coins();

  return {
    bank,
    coins: coins as any as ICoin[],
    assetExchange,
    tradeObservable,
  };
}
