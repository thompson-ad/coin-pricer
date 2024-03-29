import { useCoinsContext } from "../providers/CoinsProvider";

export const CoinPriceList = () => {
  const { coins } = useCoinsContext();
  return (
    <section>
      {coins.map((coin) => {
        return (
          <div data-testid="coin" key={coin.uuid} className="coinContainer">
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
    </section>
  );
};
