import { Injectable, signal } from '@angular/core';
import globalMarketData from '../mock/globalMarket.json';

@Injectable({
  providedIn: 'root'
})
export class CoingeckoService {
  public globalMarket = signal<GlobalMarket | null>(null);

  constructor() {
    this.getGlobalMarketData();
  }

  getGlobalMarketData(): any {
    this.globalMarket.set(globalMarketData);
    // TODO
  }
}
