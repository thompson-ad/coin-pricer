import { fetchSupportedCoins } from "../api/api";
import type { Asset } from "./Asset";

export interface ICoin {
  uuid: Asset;
  name: string;
  priceInUsd: number;
  symbol: string;
  iconUrl: string;
}

export type CoinObserver = (coins: ICoin[]) => void;

export class Coins {
  private observers: CoinObserver[] = [];
  private intervalId: any = null;

  public async getCoins() {
    let coins: ICoin[] = [];
    try {
      coins = await fetchSupportedCoins();
    } catch (error: unknown) {
      console.error(error);
    }
    return coins;
  }

  public updateCoins(delay: number) {
    this.intervalId = setInterval(async () => {
      const coins = await this.getCoins();
      this.notify(coins);
    }, delay);
  }

  public cleanUpdates() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public subscribe(func: CoinObserver) {
    this.observers.push(func);
  }

  public unsubscribe(func: CoinObserver) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  private notify(coins: ICoin[]) {
    this.observers.forEach((observer) => observer(coins));
  }
}
