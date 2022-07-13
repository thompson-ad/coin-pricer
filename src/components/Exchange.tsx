import Bank from "../core/Bank";
import { ChangeEvent, useState, SyntheticEvent } from "react";
import { Asset } from "../core/Asset";
import AssetExchange from "../core/Exchange";
import TradeObservable from "../core/TradeObservable";
import { useErrorContext } from "../providers/ErrorProvider";
import { useCoinsContext } from "../providers/CoinsProvider";

export const Exchange = () => {
  const [amount, setAmount] = useState(0);
  const [sourceValue, setSourceValue] = useState(Asset.USD);
  const [destinationValue, setDestinationValue] = useState(Asset.BTC);
  const [isLoading, setIsLoading] = useState(false);
  const { error, addError, removeError } = useErrorContext();
  const { coins: availableDestinations } = useCoinsContext();

  const availableSourceUuids = Bank.balances;
  const availableSources = availableDestinations.filter((coin) =>
    availableSourceUuids.has(coin.uuid)
  );

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const trade = await AssetExchange.exchange(
        sourceValue,
        destinationValue,
        amount
      );
      TradeObservable.notify(trade);
    } catch (error: any) {
      addError(error.message);
    }
    setIsLoading(false);
  };

  const handleOnSourceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSourceValue = e.target.value as Asset;
    if (newSourceValue === destinationValue) {
      addError("Source and destination cannot be the same");
    } else if (newSourceValue !== Asset.USD && destinationValue !== Asset.USD) {
      addError("Source or destination must be USD");
    } else {
      removeError();
    }

    setSourceValue(newSourceValue);
  };

  const handleOnDestinationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newDestinationValue = e.target.value as Asset;
    if (newDestinationValue === sourceValue) {
      addError("Source and destination cannot be the same");
    } else if (newDestinationValue !== Asset.USD && sourceValue !== Asset.USD) {
      addError("Source or destination must be USD");
    } else {
      removeError();
    }
    setDestinationValue(newDestinationValue);
  };

  const handleOnAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    removeError();
    const exchangeAmount = parseFloat(e.target.value);
    setAmount(exchangeAmount);
  };

  if (isLoading) {
    return <p data-testid="exchanging">Exchanging...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="source">From:</label>
        <select
          value={sourceValue}
          onChange={handleOnSourceChange}
          name="from"
          id="source"
        >
          {availableSources.map((source) => (
            <option value={source.uuid}>{source.name}</option>
          ))}
        </select>
        <label htmlFor="destination">To:</label>
        <select
          value={destinationValue}
          name="to"
          id="destination"
          onChange={handleOnDestinationChange}
        >
          {availableDestinations.map((destination) => (
            <option value={destination.uuid}>{destination.name}</option>
          ))}
        </select>
        <label htmlFor="amount">Amount:</label>
        <input
          onChange={handleOnAmountChange}
          id="amount"
          type="number"
          step=".01"
          value={amount}
        />
      </div>
      <button disabled={!!error} type="submit">
        Submit
      </button>
      {error && typeof error === "string" ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : null}
    </form>
  );
};
