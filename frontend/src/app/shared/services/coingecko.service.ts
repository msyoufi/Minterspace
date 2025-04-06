import { inject, Injectable, signal } from '@angular/core';
import globalMarketData from '../mock/globalMarket.json';
import allCategories from '../mock/all-categories.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoingeckoService {
  http = inject(HttpClient);

  BASE_URL = 'http://127.0.0.1:8000/coingecko';

  public globalMarket = signal<GlobalMarket | null>(null);
  public coinCategories = signal<CoinCategory[]>([]);

  constructor() {
    this.getGlobalMarketData();
    this.getCoinCategories();
  }

  getGlobalMarketData(): any {
    this.globalMarket.set(globalMarketData);
    // TODO
  }

  getCoinsList(additionalParams: { [key: string]: any }): Observable<CoinBasic[]> {
    const url = `${this.BASE_URL}/coins`;

    const params = {
      vs_currency: 'usd',
      ...additionalParams
    };

    return this.http.get<CoinBasic[]>(url, { params });
  }

  getCoinCategories(): any {
    this.coinCategories.set(allCategories);
    // TODO
  }
}
