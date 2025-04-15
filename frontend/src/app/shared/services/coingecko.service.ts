import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import globalMarketData from '../mock/globalMarket.json';
import allCategories from '../mock/all-categories.json';

@Injectable({
  providedIn: 'root'
})
export class CoingeckoService {
  http = inject(HttpClient);

  public globalMarket = signal<GlobalMarket | null>(null);
  public coinCategories = signal<CoinCategory[]>([]);
  public TrendingCoins = signal<CoinTrending[]>([]);

  BASE_URL = 'http://127.0.0.1:8000/api/coingecko';

  constructor() {
    this.getGlobalMarketData();
    this.getCoinCategories();
    this.getTrendingAssetes();
  }

  async getGlobalMarketData(): Promise<void> {
    const url = `${this.BASE_URL}/global`;

    const response$ = this.http.get<GlobalMarket>(url);
    const globalMarket = await firstValueFrom(response$);

    this.globalMarket.set(globalMarket);
  }

  async getCoinsList(additionalParams: { [key: string]: any }): Promise<CoinBasic[]> {
    const url = `${this.BASE_URL}/coins`;

    const params = {
      vs_currency: 'usd',
      ...additionalParams
    };

    const response$ = this.http.get<CoinBasic[]>(url, { params });
    return await firstValueFrom(response$);
  }

  async getCoinDetails(coinId: string): Promise<CoinDetails> {
    const url = `${this.BASE_URL}/coins/${coinId}`;
    const response$ = this.http.get<CoinDetails>(url);
    return await firstValueFrom(response$);
  }

  async getCoinChartsData(coinId: string, days: number): Promise<CoinCharts> {
    const url = `${this.BASE_URL}/coins/charts/${coinId}`;

    const params = {
      vs_currency: 'usd',
      days
    };

    const response$ = this.http.get<CoinCharts>(url, { params });
    return await firstValueFrom(response$);
  }

  async getCoinCategories(): Promise<void> {
    const url = `${this.BASE_URL}/categories`;

    const response$ = this.http.get<CoinCategory[]>(url);
    const categories = await firstValueFrom(response$);

    this.coinCategories.set(categories);
  }

  searchCoinGecko(query: string): Observable<SearchResults> {
    const url = `${this.BASE_URL}/search`;
    return this.http.get<SearchResults>(url, { params: { query } });
  }

  async getTrendingAssetes(): Promise<void> {
    const url = `${this.BASE_URL}/trending`;

    const response$ = this.http.get<TrendingAssets>(url);
    const trendingAssets = await firstValueFrom(response$);

    const trendingCoins = trendingAssets.coins.map(c => c.item);
    this.TrendingCoins.set(trendingCoins);
  }
}
