import { Asset } from "./Asset";

export class Bank {
  private accountBalances: Map<Asset, number>;

  constructor() {
    this.accountBalances = new Map();
    this.accountBalances.set(Asset.USD, 1000.0);
  }

  public get assetAccounts(): Asset[] {
    return Array.from(this.accountBalances.keys());
  }

  public getBalance(asset: Asset) {
    return this.accountBalances.get(asset) || 0.0;
  }

  public get balances(): Map<Asset, number> {
    return new Map(this.accountBalances);
  }

  public setBalance(asset: Asset, newBalance: number) {
    if (newBalance < 0) {
      throw new Error(
        "Trying to set balance to an overdrawn value - we don't support overdrafts!"
      );
    }

    this.accountBalances.set(asset, newBalance);
  }

  public adjustBalance(asset: Asset, adjustment: number) {
    const currentBalance = this.getBalance(asset);
    if (adjustment < 0 && Math.abs(adjustment) > currentBalance) {
      throw new Error("Insufficient balance for asset to perform adjustment");
    }

    this.setBalance(asset, this.getBalance(asset) + adjustment);
  }
}
