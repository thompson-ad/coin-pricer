import { useCallback, useEffect, useState } from "react";
import { ITrade } from "../core/Exchange";
import TradeObservable from "../core/TradeObservable";
import { useCoinsContext } from "../providers/CoinsProvider";

export const TradeHistory = () => {
  const { coins } = useCoinsContext();
  const [trades, setTrades] = useState<ITrade[]>([]);

  const tradeHistory = trades.map((trade) => {
    const sourceDetails = coins.filter((c) => c.uuid === trade.Source)[0];
    const destinationDetails = coins.filter(
      (c) => c.uuid === trade.Destination
    )[0];
    return {
      executedAt: trade.ExecutedAt,
      source: sourceDetails,
      destination: destinationDetails,
      volume: trade.Volume,
      price: trade.Price,
    };
  });

  const onTradesChanged = useCallback((trade: ITrade) => {
    setTrades((prevState) => [...prevState, trade]);
  }, []);

  useEffect(() => {
    TradeObservable.subscribe(onTradesChanged);
    return () => TradeObservable.unsubscribe(onTradesChanged);
  }, [onTradesChanged]);

  return (
    <section>
      <table>
        <tr>
          <th>Source:</th>
          <th>Destination:</th>
          <th>Volume:</th>
          <th>Price in source asset:</th>
          <th>Executed at:</th>
        </tr>
        {tradeHistory.map(
          ({ executedAt, source, destination, volume, price }) => {
            return (
              <tr data-testid="trade" key={executedAt.toISOString()}>
                <td>{source.name}</td>
                <td>{destination.name}</td>
                <td>{volume}</td>
                <td>{price.toFixed(2)}</td>
                <td>{executedAt.toUTCString()}</td>
              </tr>
            );
          }
        )}
      </table>
    </section>
  );
};
