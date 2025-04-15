import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private http = inject(HttpClient);

  public watchlists = signal<Watchlist[]>([]);
  public allWatchlistsCoins = computed<Set<string>>(() => this.getCoinIdsSet());

  private BASE_URL = 'http://127.0.0.1:8000/api/watchlist';

  constructor() {
    this.getAllWatchlists();
  }

  getCoinIdsSet(): Set<string> {
    const allCoinIds = this.watchlists().flatMap(wl => wl.coins);
    return new Set(allCoinIds);
  }

  async getAllWatchlists(): Promise<void> {
    const url = `${this.BASE_URL}/`;

    const response$ = this.http.get<Watchlist[]>(url);
    const watchlists = await firstValueFrom(response$);

    this.watchlists.set(watchlists);
  }

  async createWatchlist(coinIds: string[]): Promise<void> {
    const url = `${this.BASE_URL}/`;
    const body = { coins: coinIds };

    const response$ = this.http.post<Watchlist>(url, body);
    const createdWatchlist = await firstValueFrom(response$);

    this.watchlists.set([...this.watchlists(), createdWatchlist]);
  }

  async updateWatchlist(watchlistId: number | bigint, coinIds: string[]): Promise<void> {
    const url = `${this.BASE_URL}/${watchlistId}`;
    const body = { coins: coinIds };

    const response$ = this.http.put<Watchlist>(url, body);
    const updatedWatchlist = await firstValueFrom(response$);

    const index = this.watchlists().findIndex(wl => wl.id === watchlistId);

    if (index < 0)
      throw new Error('not found');

    const newWatchlists = this.watchlists().splice(index, 1, updatedWatchlist);

    this.watchlists.set(newWatchlists);
  }

  async deleteWatchlist(watchlistId: number | bigint): Promise<void> {
    const url = `${this.BASE_URL}/${watchlistId}`;

    const response$ = this.http.delete<null>(url);
    await firstValueFrom(response$);

    this.watchlists.set(this.watchlists().filter(wl => wl.id !== watchlistId));
  }
}
