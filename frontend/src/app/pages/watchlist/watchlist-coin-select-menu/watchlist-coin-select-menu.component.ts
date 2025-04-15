import { Component, inject, output, signal } from '@angular/core';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { MiniCoinsListComponent } from "../../../shared/components/mini-coins-list/mini-coins-list.component";
import { CoingeckoService } from '../../../shared/services/coingecko.service';

@Component({
  selector: 'ms-watchlist-coin-select-menu',
  imports: [ClickOutsideDirective, SearchBarComponent, MiniCoinsListComponent],
  templateUrl: './watchlist-coin-select-menu.component.html',
  styleUrl: './watchlist-coin-select-menu.component.scss'
})
export class WatchlistCoinSelectMenuComponent {
  coinService = inject(CoingeckoService);

  coins = signal<(CoinSearch | CoinTrending)[]>([]);
  selectedCoins = signal<{ id: string, symbol: string }[]>([]);
  isLoading = signal<boolean>(false);
  message = signal('');

  selectMenuClose = output<void>();

  constructor() {
    this.coins.set(this.coinService.TrendingCoins());
  }

  onSearchResults(searchResults: SearchResults | null): void {
    if (!searchResults) return;

    if (!searchResults.coins.length) {
      this.coins.set([]);
      return this.message.set('No results found!');
    }

    this.coins.set(searchResults.coins);
  }

  onCoinBarClick(coin: CoinBasic | CoinSearch | CoinTrending): void {
    const { id, symbol } = coin;
    const newSelectedCoins = [...this.selectedCoins(), { id, symbol }];
    this.selectedCoins.set(newSelectedCoins);
  }

  onCoinToggleClick(coinId: string): void {
    const newSelectedCoins = this.selectedCoins().filter(c => c.id !== coinId);
    this.selectedCoins.set(newSelectedCoins);
  }

  onIsLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  closeMenu(): void {
    this.selectMenuClose.emit();
  }
}
