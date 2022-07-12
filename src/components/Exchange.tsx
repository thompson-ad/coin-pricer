import { Coin } from "./CoinPriceList";
import Bank from "../core/Bank";
import { ChangeEvent, useState, SyntheticEvent } from "react";
import { Asset } from "../core/Asset";
import AssetExchange from "../core/Exchange";

interface ExchangeProps {
  coins: Coin[];
}

export const Exchange = ({ coins: availableDestinations }: ExchangeProps) => {
  const [amount, setAmount] = useState(0);
  const [sourceValue, setSourceValue] = useState(Asset.USD);
  const [destinationValue, setDestinationValue] = useState(Asset.BTC);
  const [errorMessage, setErrorMessage] = useState("");

  const availableSourceUuids = Bank.balances;
  const availableSources = availableDestinations.filter((coin) =>
    availableSourceUuids.has(coin.uuid)
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    AssetExchange.exchange(sourceValue, destinationValue, amount);
  };

  const handleOnSourceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // Validate at least source or destination is "USD"
    // Don't let the user change to the target value if it means one of source of destination will not be USD
    const newSourcevalue = e.target.value as Asset;
    if (newSourcevalue === destinationValue) {
      setErrorMessage("Source and destination cannot be the same");
    } else if (newSourcevalue !== Asset.USD && destinationValue !== Asset.USD) {
      setErrorMessage("Source or destination must be USD");
    } else {
      setErrorMessage("");
    }

    setSourceValue(newSourcevalue);
  };

  const handleOnDestinationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // Validate at least source or detination is "USD"
    const newDestinationValue = e.target.value as Asset;
    if (newDestinationValue === sourceValue) {
      setErrorMessage("Source and destination cannot be the same");
    } else if (newDestinationValue !== Asset.USD && sourceValue !== Asset.USD) {
      setErrorMessage("Source or destination must be USD");
    } else {
      setErrorMessage("");
    }
    setDestinationValue(newDestinationValue);
  };

  const handleOnAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Validate enough money
    // check fund in source
    const exchangeAmount = parseFloat(e.target.value);
    const currentBalance = Bank.getBalance(sourceValue);
    if (currentBalance < exchangeAmount) {
      setErrorMessage("You have insufficient funds in your account");
    } else {
      setErrorMessage("");
    }
    setAmount(exchangeAmount);
  };

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
          value={amount}
        />
      </div>
      <button disabled={!!errorMessage} type="submit">
        Submit
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </form>
  );
};
