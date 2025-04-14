import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import globalMarketData from '../mock/globalMarket.json';
import allCategories from '../mock/all-categories.json';

@Injectable({
  providedIn: 'root'
})
export class CoingeckoService {
  http = inject(HttpClient);
  destroyRef = inject(DestroyRef);

  public globalMarket = signal<GlobalMarket | null>(null);
  public coinCategories = signal<CoinCategory[]>([]);

  BASE_URL = 'http://127.0.0.1:8000/api/coingecko';

  constructor() {
    this.getGlobalMarketData();
    this.getCoinCategories();
  }

  getGlobalMarketData(): void {
    // this.http.get<GlobalMarket>(`${this.BASE_URL}/global`)
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe(GlobalMarket => {
    //     this.globalMarket.set(GlobalMarket);
    //   });

    this.globalMarket.set(globalMarketData);
  }

  getCoinsList(additionalParams: { [key: string]: any }): Observable<CoinBasic[]> {
    const url = `${this.BASE_URL}/coins`;

    const params = {
      vs_currency: 'usd',
      ...additionalParams
    };

    return this.http.get<CoinBasic[]>(url, { params });
  }

  getCoinDetails(coinId: string): Observable<CoinDetails> {
    const url = `${this.BASE_URL}/coins/${coinId}`;
    return this.http.get<CoinDetails>(url);
  }

  getCoinChartsData(coinId: string, days: number): Observable<CoinCharts> {
    const url = `${this.BASE_URL}/coins-charts/${coinId}`;

    const params = {
      vs_currency: 'usd',
      days
    };

    return this.http.get<CoinCharts>(url, { params });
  }

  getCoinCategories(): any {
    this.coinCategories.set(allCategories);
    // TODO
  }

  searchCoinGecko(query: string): Observable<SearchResults> {
    const url = `${this.BASE_URL}/search`;
    return this.http.get<SearchResults>(url, { params: { query } });
  }
}
