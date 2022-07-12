import { Coin } from "./CoinPriceList";
import Bank from "../core/Bank";

interface AccountListProps {
  coins: Coin[];
}

export const AccountList = ({ coins }: AccountListProps) => {
  // create account data from available balances and coins data
  const accounts = Bank.balances;
  const accountData = coins.filter((coin) => accounts.has(coin.uuid));

  return (
    <>
      {accountData.map((account) => {
        return (
          <div key={account?.uuid} className="accountContainer">
            <img
              src={account?.iconUrl}
              alt={`${account?.name} icon`}
              className="icon"
            />
            <div>
              <p>{account?.name}</p>
              <p>{account?.symbol}</p>
            </div>
            <p>{`$${Bank.getBalance(account?.uuid)}`}</p>
          </div>
        );
      })}
    </>
  );
};
