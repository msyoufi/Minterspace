import { Component, inject, signal } from '@angular/core';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { EscapePressDirective } from '../../../shared/directives/escape-press.directive';
import { MiniCoinsListComponent } from '../../../shared/components/mini-coins-list/mini-coins-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'ms-header-search',
  imports: [ClickOutsideDirective, SearchBarComponent, EscapePressDirective, MiniCoinsListComponent],
  templateUrl: './header-search.component.html',
  styleUrl: './header-search.component.scss'
})
export class HeaderSearchComponent {
  router = inject(Router);

  searchResults = signal<SearchResults | null>(null);
  isSearchPanelOpen = signal(false);
  isLoading = signal(false);
  startMessage = 'Search coins by name or ticker symbol';
  message = signal(this.startMessage);

  onSearchResults(searchResults: SearchResults | null): void {
    if (!searchResults)
      return this.closeSearchPanel();

    if (!searchResults.coins.length) {
      this.searchResults.set(null);
      return this.message.set('No results found!');
    }

    this.searchResults.set(searchResults);
  }

  onIsLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
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
    this.searchResults.set(null);
    this.message.set(this.startMessage);
  }
}
