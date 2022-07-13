import { useCallback, useEffect, useState } from "react";
import Bank from "../core/Bank";
import { ICoin } from "../core/Coins";
import TradeObservable from "../core/TradeObservable";
import { useCoinsContext } from "../providers/CoinsProvider";

export const AccountList = () => {
  const { coins } = useCoinsContext();
  const [accounts, setAccounts] = useState<ICoin[]>([]);

  const onAccountsChanged = useCallback(() => {
    const accounts = coins.filter((coin) => Bank.balances.has(coin.uuid));
    setAccounts(accounts);
  }, [coins]);

  useEffect(() => {
    onAccountsChanged();
    TradeObservable.subscribe(onAccountsChanged);
    return () => TradeObservable.unsubscribe(onAccountsChanged);
  }, [onAccountsChanged]);

  return (
    <section>
      {accounts.map((account) => {
        return (
          <div
            data-testid="account"
            key={account?.uuid}
            className="accountContainer"
          >
            <img
              src={account?.iconUrl}
              alt={`${account?.name} icon`}
              className="icon"
            />
            <p>{account?.symbol}</p>
            <p>{`${Bank.getBalance(account?.uuid).toFixed(2)}`}</p>
          </div>
        );
      })}
    </section>
  );
};
