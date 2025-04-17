import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  private BASE_URL = 'http://127.0.0.1:8000/api/watchlist/';

  public watchlists$ = signal<Watchlist[]>([]);
  public currentWatchlist$ = signal<Watchlist | null>(null);

  // The main watchlist is created on accout creation and cannot be deleted by the user
  public mainWatchlist = computed(() =>
    this.watchlists$().find(wl => wl.is_main) ?? null
  );

  constructor() {
    effect(() => this.getUserWatchlists());
  }

  getUserWatchlists(): void {
    this.authService.user$()
      ? this.getAllWatchlists()
      : this.setWatchlists([], null);
  }

  async getAllWatchlists(): Promise<void> {
    const watchlists = await this.fetchFromBackend();
    const mainWatchlist = watchlists.find(wl => wl.is_main) ?? null;

    this.setWatchlists(watchlists, mainWatchlist);
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

  async createWatchlist(name: string, is_main = false): Promise<Watchlist | null> {
    const createdWatchlist = await this.createInBackend({ name, is_main });
    if (!createdWatchlist) return null;

    const newWatchlists = [...this.watchlists$(), createdWatchlist];
    this.setWatchlists(newWatchlists, createdWatchlist);

    return createdWatchlist;
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

  async updateWatchlist(watchlistId: number | bigint, changes: { name?: string, coins?: string[] }): Promise<Watchlist | null> {
    if (!changes.coins && !changes.name) {
      console.log('No changes were provided for an update');
      return null;
    }

    const updatedWatchlist = await this.updateInBackend(watchlistId, changes);
    if (!updatedWatchlist) return null;

    const newWatchlists = this.watchlists$().map(wl =>
      wl.id === watchlistId ? updatedWatchlist : wl
    );

    this.setWatchlists(newWatchlists, updatedWatchlist);

    return updatedWatchlist;
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

  async deleteWatchlist(watchlistId: number | bigint): Promise<boolean> {
    if (watchlistId === this.mainWatchlist()?.id) {
      console.log('Cannot delete the main watchlist');
      return false;
    }

    const result = await this.deleteInBackend(watchlistId);
    if (!result) return false;

    const newWatchlists = this.watchlists$().filter(wl => wl.id !== watchlistId);
    this.setWatchlists(newWatchlists, this.mainWatchlist());

    return true;
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

  public setCurrentWatchlistById(id: number | bigint) {
    const watchlist = this.watchlists$().find(wl => wl.id === id) ?? null;
    this.currentWatchlist$.set(watchlist);
  }

  private handleError(err: unknown): void {
    console.log(err);
  }
}