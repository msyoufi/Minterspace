import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private http = inject(HttpClient);

  public watchlists$ = signal<Watchlist[]>([]);
  public currentWatchlist$ = signal<Watchlist | null>(null);
  public mainWatchlist = computed<Watchlist | null>(() => this.watchlists$()[0] ?? null);

  private BASE_URL = 'http://127.0.0.1:8000/api/watchlist';

  constructor() {
    this.getAllWatchlists();
  }

  async getAllWatchlists(): Promise<void> {
    const url = `${this.BASE_URL}/`;

    try {
      const response$ = this.http.get<Watchlist[]>(url);
      const watchlists = await firstValueFrom(response$);

      this.watchlists$.set(watchlists);
      this.currentWatchlist$.set(this.mainWatchlist());

    } catch (err: unknown) {
      this.handleError(err);
    }
  }

  async createWatchlist(name: string, coins: string[]): Promise<void> {
    const url = `${this.BASE_URL}/`;
    const body = { name, coins };

    try {
      const response$ = this.http.post<Watchlist>(url, body);
      const createdWatchlist = await firstValueFrom(response$);

      this.watchlists$.set([...this.watchlists$(), createdWatchlist]);
      this.currentWatchlist$.set(createdWatchlist);

    } catch (err: unknown) {
      this.handleError(err);
    }
  }

  async updateWatchlist(watchlistId: number | bigint, changes: { name?: string, coins?: string[] }): Promise<void> {
    const url = `${this.BASE_URL}/${watchlistId}`;

    try {
      const response$ = this.http.patch<Watchlist>(url, changes);
      const updatedWatchlist = await firstValueFrom(response$);

      const index = this.watchlists$().findIndex(wl => wl.id === watchlistId);

      if (index < 0)
        throw new Error('not found');

      const newWatchlists = this.watchlists$().map(wl =>
        wl.id === watchlistId ? updatedWatchlist : wl
      );

      this.watchlists$.set(newWatchlists);
      this.currentWatchlist$.set(updatedWatchlist);

    } catch (err: unknown) {
      this.handleError(err);
    }
  }

  async deleteWatchlist(watchlistId: number | bigint): Promise<void> {
    const url = `${this.BASE_URL}/${watchlistId}`;
    try {
      const response$ = this.http.delete<null>(url);
      await firstValueFrom(response$);

      this.watchlists$.set(this.watchlists$().filter(wl => wl.id !== watchlistId));
      this.currentWatchlist$.set(this.mainWatchlist());

    } catch (err: unknown) {
      this.handleError(err);
    }
  }

  private handleError(err: unknown): void {
    console.log(err);
  }
}
