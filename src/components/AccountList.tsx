import { Coin } from "./CoinPriceList";
import Bank from "../core/Bank";
interface AccountListProps {
  accounts: Coin[];
}

export const AccountList = ({ accounts }: AccountListProps) => {
  // The app holds coin state whereas the Bank singleton holds app global state
  // I need onAccountsChanged to subscribe to changes to the bank
  return (
    <>
      {accounts.map((account) => {
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
