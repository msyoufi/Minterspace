import { Component, effect, inject, signal } from '@angular/core';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { EscapePressDirective } from '../../../shared/directives/escape-press.directive';
import { Router } from '@angular/router';
import { MiniCoinBarComponent } from '../../../shared/components/mini-coin-bar/mini-coin-bar.component';
import { CoingeckoService } from '../../../shared/services/coingecko.service';

@Component({
  selector: 'ms-header-search',
  imports: [ClickOutsideDirective, SearchBarComponent, EscapePressDirective, MiniCoinBarComponent],
  templateUrl: './header-search.component.html',
  styleUrl: './header-search.component.scss'
})
export class HeaderSearchComponent {
  coinService = inject(CoingeckoService);
  router = inject(Router);

  coins = signal<(CoinTrending | CoinSearch)[]>([]);
  isSearchPanelOpen = signal(false);
  isSearching = signal(false);
  startMessage = 'Search coins by name or ticker symbol';
  message = signal(this.startMessage);

  constructor() {
    effect(() => this.coins.set(this.coinService.TrendingCoins()));
  }

  onSearchResults(searchResults: SearchResults | null): void {
    if (!searchResults)
      return this.closeSearchPanel();

    if (!searchResults.coins.length) {
      this.coins.set([]);
      return this.message.set('No results found!');
    }

    this.coins.set(searchResults.coins);
  }

  onIsSearching(isSearching: boolean): void {
    console.log('isSearching', isSearching)
    this.isSearching.set(isSearching);
  }

  onCoinBarClick(coin: CoinBasic | CoinSearch | CoinTrending): void {
    this.closeSearchPanel();
    this.router.navigateByUrl(`coins/${coin.id}`);
  }

  openSearchPanel(e: MouseEvent | FocusEvent): void {
    this.isSearchPanelOpen.set(true);
  }

  closeSearchPanel(): void {
    this.isSearchPanelOpen.set(false);
    this.coins.set(this.coinService.TrendingCoins());
    this.message.set(this.startMessage);
  }
}
