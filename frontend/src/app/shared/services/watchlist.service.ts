import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from './error.service';
import API_URL from '../../../secrets/api-url';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  private BASE_URL = API_URL + '/watchlist/';

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
    const watchlists = await this.fetch();
    const mainWatchlist = watchlists.find(wl => wl.is_main) ?? null;

    this.setWatchlists(watchlists, mainWatchlist);
  }

  private async fetch(): Promise<Watchlist[]> {
    try {
      const response$ = this.http.get<Watchlist[]>(this.BASE_URL);
      return await firstValueFrom(response$);

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return [];
    }
  }

  async createWatchlist(name: string, is_main = false): Promise<Watchlist | null> {
    const createdWatchlist = await this.create({ name, is_main });
    if (!createdWatchlist) return null;

    const newWatchlists = [...this.watchlists$(), createdWatchlist];
    this.setWatchlists(newWatchlists, createdWatchlist);

    return createdWatchlist;
  }

  private async create(watchlistData: Omit<Watchlist, 'coins' | 'id'>): Promise<Watchlist | null> {
    try {
      const response$ = this.http.post<Watchlist>(this.BASE_URL, watchlistData);
      return await firstValueFrom(response$);

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return null;
    }
  }

  async updateWatchlist(watchlistId: number | bigint, changes: { name?: string, coins?: string[] }): Promise<Watchlist | null> {
    if (!changes.coins && !changes.name)
      return null;

    const updatedWatchlist = await this.update(watchlistId, changes);
    if (!updatedWatchlist) return null;

    const newWatchlists = this.watchlists$().map(wl =>
      wl.id === watchlistId ? updatedWatchlist : wl
    );

    this.setWatchlists(newWatchlists, updatedWatchlist);

    return updatedWatchlist;
  }

  private async update(watchlistId: number | bigint, changes: { name?: string, coins?: string[] }): Promise<Watchlist | null> {
    try {
      const response$ = this.http.patch<Watchlist>(this.BASE_URL + watchlistId, changes);
      return await firstValueFrom(response$);

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return null;
    }
  }

  async deleteWatchlist(watchlistId: number | bigint): Promise<boolean> {
    if (watchlistId === this.mainWatchlist()?.id)
      return false;

    const result = await this.delete(watchlistId);
    if (!result) return false;

    const newWatchlists = this.watchlists$().filter(wl => wl.id !== watchlistId);
    this.setWatchlists(newWatchlists, this.mainWatchlist());

    return true;
  }

  private async delete(watchlistId: number | bigint): Promise<boolean> {
    try {
      const response$ = this.http.delete<null>(this.BASE_URL + watchlistId);
      await firstValueFrom(response$);

      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }

  private setWatchlists(all: Watchlist[], current: Watchlist | null): void {
    this.watchlists$.set(all);
    this.currentWatchlist$.set(current);
  }
}