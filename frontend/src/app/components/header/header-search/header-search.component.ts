import { Component, inject, signal } from '@angular/core';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { EscapePressDirective } from '../../../shared/directives/escape-press.directive';
import { Router } from '@angular/router';
import { MiniCoinBarComponent } from "../../../shared/components/mini-coin-bar/mini-coin-bar.component";

@Component({
  selector: 'ms-header-search',
  imports: [ClickOutsideDirective, SearchBarComponent, EscapePressDirective, MiniCoinBarComponent],
  templateUrl: './header-search.component.html',
  styleUrl: './header-search.component.scss'
})
export class HeaderSearchComponent {
  router = inject(Router);

  searchResults = signal<SearchResults | null>(null);
  isSearchPanelOpen = signal(false);
  isLoading = signal(false);
  message = signal('Search coins by name or ticker symbol');

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

  onCoinBarClick(coinId: string): void {
    this.closeSearchPanel();
    this.router.navigateByUrl(`coins/${coinId}`);
  }

  openSearchPanel(e: MouseEvent | FocusEvent): void {
    this.isSearchPanelOpen.set(true);
  }

  closeSearchPanel(): void {
    this.isSearchPanelOpen.set(false);
    this.searchResults.set(null);
  }
}
