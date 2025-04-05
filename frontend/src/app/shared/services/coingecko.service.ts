import { Injectable, signal } from '@angular/core';
import globalMarketData from '../mock/globalMarket.json';
import coins from '../mock/coins.json';
import allCategories from '../mock/all-categories.json';

@Injectable({
  providedIn: 'root'
})
export class CoingeckoService {
  public globalMarket = signal<GlobalMarket | null>(null);
  public coins = signal<CoinBasic[]>([]);
  public coinCategories = signal<CoinCategory[]>([]);

  constructor() {
    this.getGlobalMarketData();
    this.getCoinCategories();
  }

  getGlobalMarketData(): any {
    this.globalMarket.set(globalMarketData);
    // TODO
  }

  getCoins(): any {
    this.coins.set(coins);
    // TODO
  }

  getCoinCategories(): any {
    this.coinCategories.set(allCategories);
    // TODO
  }
}
