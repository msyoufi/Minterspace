import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { CoingeckoService } from '../../../shared/services/coingecko.service';
import { WatchlistService } from '../../../shared/services/watchlist.service';
import { EscapePressDirective } from '../../../shared/directives/escape-press.directive';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MiniCoinBarComponent } from '../../../shared/components/mini-coin-bar/mini-coin-bar.component';

@Component({
  selector: 'ms-watchlist-coin-select-menu',
  imports: [ClickOutsideDirective, EscapePressDirective, SearchBarComponent, MatProgressSpinner, MiniCoinBarComponent],
  templateUrl: './watchlist-coin-select-menu.component.html',
  styleUrl: './watchlist-coin-select-menu.component.scss'
})
export class WatchlistCoinSelectMenuComponent implements OnInit {
  coinService = inject(CoingeckoService);
  watchlistService = inject(WatchlistService);

  coins = signal<(CoinSearch | CoinTrending)[]>([]);
  selectedCoins = signal<{ id: string, symbol: string }[]>([]);
  allCoinsIds = computed(() => this.getAllCoinsIds());

  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  message = signal('');

  selectMenuClose = output<void>();

  ngOnInit(): void {
    this.setTrendingCoins();
  }

  getAllCoinsIds(): string[] {
    const currentCoinsIds = this.watchlistService.currentWatchlist$()?.coins ?? [];
    const selectedCoinsIds = this.selectedCoins().map(c => c.id);

    return selectedCoinsIds.concat(currentCoinsIds);
  }

  setTrendingCoins(): void {
    this.coins.set(this.coinService.TrendingCoins());
  }

  onSearchResults(searchResults: SearchResults | null): void {
    if (!searchResults) return;

    if (!searchResults.coins.length) {
      this.coins.set([]);
      return this.message.set('No results found');
    }

    this.coins.set(searchResults.coins);
  }

  onCoinBarClick(coin: CoinBasic | CoinSearch | CoinTrending): void {
    if (this.allCoinsIds().includes(coin.id))
      return console.log('Already in Watchlist');

    const { id, symbol } = coin;
    const newSelectedCoins = [...this.selectedCoins(), { id, symbol }];

    this.selectedCoins.set(newSelectedCoins);
  }

  onCoinRemoveClick(coinId: string): void {
    const newSelectedCoins = this.selectedCoins().filter(c => c.id !== coinId);
    this.selectedCoins.set(newSelectedCoins);
  }

  async onSaveClick(): Promise<void> {
    this.isSaving.set(true);

    const watchlistId = this.watchlistService.currentWatchlist$()!.id;
    const watchlist = await this.watchlistService.updateWatchlist(watchlistId, { coins: this.allCoinsIds() });

    if (!watchlist) return;

    this.isSaving.set(false);
    this.closeMenu();
  }

  onIsSearching(isSearching: boolean): void {
    this.isLoading.set(isSearching);
  }

  closeMenu(): void {
    this.selectMenuClose.emit();
  }
}