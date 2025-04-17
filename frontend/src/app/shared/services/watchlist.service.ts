import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  public watchlists$ = signal<Watchlist[]>([]);
  public currentWatchlist$ = signal<Watchlist | null>(null);

  // The main watchlist is created on accout creation and cannot be deleted by the user
  public mainWatchlist = computed<Watchlist | null>(() =>
    this.watchlists$().find(wl => wl.is_main) ?? null
  );

  private BASE_URL = 'http://127.0.0.1:8000/api/watchlist/';

  constructor() {
    this.getUserWatchlists();
  }

  getUserWatchlists(): void {
    effect(() => {
      this.authService.user$()
        ? this.getAllWatchlists()
        : this.setWatchlists([], null);
    });
  }

  async getAllWatchlists(): Promise<void> {
    const watchlists = await this.fetchFromBackend();
    const currentWatchlist = watchlists.find(wl => wl.is_main) ?? null;

    this.setWatchlists(watchlists, currentWatchlist);
  }

  private async fetchFromBackend(): Promise<Watchlist[]> {
    try {
      const response$ = this.http.get<Watchlist[]>(this.BASE_URL);
      return await firstValueFrom(response$);

    } catch (err: unknown) {
      this.handleError(err);
      return [];
    }
  }

  async createWatchlist(name: string, is_main = false): Promise<void> {
    const createdWatchlist = await this.createInBackend({ name, is_main });
    if (!createdWatchlist) return;

    const newWatchlists = [...this.watchlists$(), createdWatchlist];
    this.setWatchlists(newWatchlists, createdWatchlist);
  }

  private async createInBackend(watchlistData: Omit<Watchlist, 'coins' | 'id'>): Promise<Watchlist | null> {
    try {
      const response$ = this.http.post<Watchlist>(this.BASE_URL, watchlistData);
      return await firstValueFrom(response$);

    } catch (err: unknown) {
      this.handleError(err);
      return null;
    }
  }

  async updateWatchlist(watchlistId: number | bigint, changes: { name?: string, coins?: string[] }): Promise<void> {
    if (!changes.coins && !changes.name)
      return console.log('No changes were provided for an update');

    const updatedWatchlist = await this.updateInBackend(watchlistId, changes);
    if (!updatedWatchlist) return;

    const newWatchlists = this.watchlists$().map(wl =>
      wl.id === watchlistId ? updatedWatchlist : wl
    );

    this.setWatchlists(newWatchlists, updatedWatchlist);
  }

  private async updateInBackend(watchlistId: number | bigint, changes: { name?: string, coins?: string[] }): Promise<Watchlist | null> {
    try {
      const response$ = this.http.patch<Watchlist>(this.BASE_URL + watchlistId, changes);
      return await firstValueFrom(response$);

    } catch (err: unknown) {
      this.handleError(err);
      return null;
    }
  }

  async deleteWatchlist(watchlistId: number | bigint): Promise<void> {
    if (watchlistId === this.mainWatchlist()?.id)
      return console.log('Cannot delete the main watchlist');

    const result = await this.deleteInBackend(watchlistId);
    if (!result) return;

    const newWatchlists = this.watchlists$().filter(wl => wl.id !== watchlistId);
    this.setWatchlists(newWatchlists, this.mainWatchlist());
  }

  private async deleteInBackend(watchlistId: number | bigint): Promise<boolean> {
    try {
      const response$ = this.http.delete<null>(this.BASE_URL + watchlistId);
      await firstValueFrom(response$);

      return true;

    } catch (err: unknown) {
      this.handleError(err);
      return false;
    }
  }

  private setWatchlists(all: Watchlist[], current: Watchlist | null): void {
    this.watchlists$.set(all);
    this.currentWatchlist$.set(current);
  }

  private handleError(err: unknown): void {
    console.log(err);
  }
}
