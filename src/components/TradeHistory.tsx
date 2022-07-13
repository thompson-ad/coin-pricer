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
    <>
      {tradeHistory.map(
        ({ executedAt, source, destination, volume, price }) => {
          return (
            <div key={executedAt.toISOString()} className="tradeContainer">
              <p>From:</p>
              <p>{source.name}</p>
              <p>To:</p>
              <p>{destination.name}</p>
              <p>Volume:</p>
              <p>{volume}</p>
              <p>ExecutedA:</p>
              <p>{volume}</p>
            </div>
          );
        }
      )}
    </>
  );
};
