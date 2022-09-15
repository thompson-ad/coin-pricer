import { Asset } from "./Asset";
import type { Bank } from "./Bank";
import type { IPricingProvider } from "./Pricer";

export interface ITrade {
  ExecutedAt: Date;
  Source: Asset;
  Destination: Asset;
  Volume: number;
  Price: number;
}

export enum ExchangeErrorKind {
  UNSPECIFIED = "Unknown",
  SOURCE_DESTINATION_EQUAL = "Source and destination asset must differ, but are the same",
  INVALID_VOLUME = "Volume invalid, must be positive amount of asset to purchase",
  INSUFFICIENT_BALANCE = "Attempted to sell source asset without sufficient balance",
  NEGATIVE_QUOTE_PRICE = "Unexpected negative quote price received",
  ZERO_QUOTE_PRICE = "Unexpected zero quote price received",
}

export class ExchangeError extends Error {
  constructor(kind: ExchangeErrorKind) {
    super(kind);
    Object.setPrototypeOf(this, ExchangeError.prototype);
  }
}

export class AssetExchange {
  private pricingProvider: IPricingProvider;
  private bank: Bank;
  private _trades: ITrade[];

  constructor(pricingProvider: IPricingProvider, bank: Bank) {
    this.pricingProvider = pricingProvider;
    this.bank = bank;

    this._trades = [];
  }

  // trades returns the history of all trades performed on the exchange.
  public get trades() {
    return this._trades;
  }

  // exchange executes a trade from the source asset to the destination asset.
  // It attempts to purchase "volume" units of the destination asset type by
  // selling the required number of the "source" asset.
  //
  // As we only have prices for USD pairs, one of source and destination is
  // always expected to be USD.
  //
  // For example:
  // source=BTC destination=USD volume=5 - we want to sell BTC to buy 5 USD
  // source=USD destination=ETH volume=1 - we want to sell USD to buy 1 ETH
  //
  // - It is an error to request to trade to and from the same asset.
  // - It is an error to try to spend more source asset than in the bank.
  // - It is an error to exchange when the Pricer cannot return a price for
  //   the source/destination combination.
  public async exchange(
    source: Asset,
    destination: Asset,
    volume: number
  ): Promise<ITrade> {
    if (source === destination) {
      throw new ExchangeError(ExchangeErrorKind.SOURCE_DESTINATION_EQUAL);
    } else if (volume <= 0) {
      throw new ExchangeError(ExchangeErrorKind.INVALID_VOLUME);
    }

    // Caution! This can throw an exception if the pricer doesn't have a pair
    // for the source/destination combination.
    const quote = await this.pricingProvider.getCoinPrice(source, destination);

    if (quote.Price < 0) {
      throw new ExchangeError(ExchangeErrorKind.NEGATIVE_QUOTE_PRICE);
    }

    if (quote.Price === 0) {
      throw new ExchangeError(ExchangeErrorKind.ZERO_QUOTE_PRICE);
    }

    const sourceAmountToSell = quote.Price * volume;
    const currentBalance = this.bank.getBalance(source);

    if (currentBalance < sourceAmountToSell) {
      throw new ExchangeError(ExchangeErrorKind.INSUFFICIENT_BALANCE);
    }

    this.bank.adjustBalance(source, -sourceAmountToSell);
    this.bank.adjustBalance(destination, volume);

    const trade = Object.assign({}, quote, {
      ExecutedAt: new Date(),
      Volume: volume,
    });
    this.trades.push(trade);

    return trade;
  }
}
