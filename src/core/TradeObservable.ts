import { ITrade } from "./Exchange";

export type TradeObserver = (trade: ITrade) => void;
export class TradeObservable {
  private observers: TradeObserver[] = [];

  public subscribe(func: TradeObserver) {
    this.observers.push(func);
  }

  public unsubscribe(func: TradeObserver) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  public notify(data: ITrade) {
    this.observers.forEach((observer) => {
      observer(data);
    });
  }
}
