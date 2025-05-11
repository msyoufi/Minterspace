import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import globalMarketMock from '../mock/globalMarket.json';
import allCategoriesMock from '../mock/all-categories.json';
import trendingMock from '../mock/trending.json';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class CoingeckoService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  public globalMarket = signal<GlobalMarket | null>(null);
  public coinCategories = signal<CoinCategory[]>([]);
  public TrendingCoins = signal<CoinTrending[]>([]);

  private BASE_URL = 'http://127.0.0.1:8000/api/coingecko';

  constructor() {
    // this.getGlobalMarketData();
    // this.getCoinCategories();
    // this.getTrendingAssetes();
    this.populateWithMockData();
  }

  populateWithMockData(): void {
    this.globalMarket.set(globalMarketMock);
    this.coinCategories.set(allCategoriesMock);
    this.TrendingCoins.set(trendingMock as CoinTrending[]);
  }

  async getGlobalMarketData(): Promise<void> {
    try {
      const response$ = this.http.get<GlobalMarket>(`${this.BASE_URL}/global`);
      const globalMarket = await firstValueFrom(response$);

      this.globalMarket.set(globalMarket);

    } catch (err: unknown) {
      this.errorService.handleError(err);
    }
  }

  async getCoinsList(additionalParams: { [key: string]: any }): Promise<CoinBasic[]> {
    const params = {
      vs_currency: 'usd',
      ...additionalParams
    };

    try {
      const response$ = this.http.get<CoinBasic[]>(`${this.BASE_URL}/coins`, { params });
      return await firstValueFrom(response$);

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return [];
    }
  }

  async getCoinDetails(coinId: string): Promise<CoinDetails | null> {
    try {
      const response$ = this.http.get<CoinDetails>(`${this.BASE_URL}/coins/${coinId}`);
      return await firstValueFrom(response$);

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return null;
    }
  }

  async getCoinChartsData(coinId: string, days: number): Promise<CoinCharts | null> {
    const params = {
      vs_currency: 'usd',
      days
    };

    try {
      const response$ = this.http.get<CoinCharts>(`${this.BASE_URL}/coins/charts/${coinId}`, { params });
      return await firstValueFrom(response$);

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return null;
    }
  }

  async getCoinCategories(): Promise<void> {
    try {
      const response$ = this.http.get<CoinCategory[]>(`${this.BASE_URL}/categories`);
      const categories = await firstValueFrom(response$);

      this.coinCategories.set(categories);

    } catch (err: unknown) {
      this.errorService.handleError(err);
    }
  }

  searchCoinGecko(query: string): Observable<SearchResults> {
    const url = `${this.BASE_URL}/search`;
    return this.http.get<SearchResults>(url, { params: { query } });
  }

  async getTrendingAssetes(): Promise<void> {
    try {
      const response$ = this.http.get<TrendingAssets>(`${this.BASE_URL}/trending`);
      const trendingAssets = await firstValueFrom(response$);

      const trendingCoins = trendingAssets.coins.map(c => c.item);
      this.TrendingCoins.set(trendingCoins);

    } catch (err: unknown) {
      this.errorService.handleError(err);
    }
  }

  async getExchanges(params: { [key: string]: any }): Promise<Exchange[]> {
    try {
      const response$ = this.http.get<Exchange[]>(`${this.BASE_URL}/exchanges`, { params });
      return await firstValueFrom(response$);

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return [];
    }
  }
}