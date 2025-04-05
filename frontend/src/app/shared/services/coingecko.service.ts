import { Injectable, signal } from '@angular/core';
import globalMarketData from '../mock/globalMarket.json';
import coins from '../mock/coins.json';

@Injectable({
  providedIn: 'root'
})
export class CoingeckoService {
  public globalMarket = signal<GlobalMarket | null>(null);
  public coins = signal<CoinBasic[]>([]);


  constructor() {
    this.getGlobalMarketData();
  }

  getGlobalMarketData(): any {
    this.globalMarket.set(globalMarketData);
    // TODO
  }

  getCoins(): any {
    this.coins.set(coins);
    // TODO
  }
}
