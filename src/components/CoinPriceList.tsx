import { Asset } from "../core/Asset";

export interface Coin {
  uuid: Asset;
  name: string;
  priceInUsd: number;
  symbol: string;
  iconUrl: string;
}

interface CoinPriceListProps {
  coins: Coin[];
}

export const CoinPriceList = ({ coins }: CoinPriceListProps) => {
  return (
    <>
      {coins.map((coin) => {
        return (
          <div key={coin.uuid} className="coinContainer">
            <img
              src={coin.iconUrl}
              alt={`${coin.name} icon`}
              className="icon"
            />
            <div>
              <p>{coin.name}</p>
              <p>{coin.symbol}</p>
            </div>
            <p>{`$${coin.priceInUsd}`}</p>
          </div>
        );
      })}
    </>
  );
};
