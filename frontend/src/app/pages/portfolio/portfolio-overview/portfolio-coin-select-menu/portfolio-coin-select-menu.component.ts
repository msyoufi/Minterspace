import { Component, effect, inject, OnInit, output, signal } from '@angular/core';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { EscapePressDirective } from '../../../../shared/directives/escape-press.directive';
import { SearchBarComponent } from '../../../../shared/components/search-bar/search-bar.component';
import { MiniCoinBarComponent } from '../../../../shared/components/mini-coin-bar/mini-coin-bar.component';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import { TransactionModalService } from '../../../../shared/services/transaction-modal.service';
import { CoingeckoService } from '../../../../shared/services/coingecko.service';
import { PortfolioService } from '../../../../shared/services/portfolio.service';

@Component({
  selector: 'ms-portfolio-coin-select-menu',
  imports: [ClickOutsideDirective, EscapePressDirective, SearchBarComponent, MiniCoinBarComponent],
  templateUrl: './portfolio-coin-select-menu.component.html',
  styleUrl: './portfolio-coin-select-menu.component.scss'
})
export class PortfolioCoinSelectMenuComponent {
  portfolioService = inject(PortfolioService);
  coinService = inject(CoingeckoService);
  transactionModalService = inject(TransactionModalService);
  snackBar = inject(SnackBarService);

  coins = signal<(CoinSearch | CoinTrending)[]>([]);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  message = signal('');

  selectMenuClose = output<void>();

  constructor() {
    effect(() => this.coins.set(this.coinService.TrendingCoins()));
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
    const portfolioId = this.portfolioService.currentPortfolio$()?.id;
    if (!portfolioId) return;

    this.transactionModalService.openModal(portfolioId, coin.id);
    this.closeMenu();
  }

  onIsSearching(isSearching: boolean): void {
    this.isLoading.set(isSearching);
  }

  closeMenu(): void {
    this.selectMenuClose.emit();
  }
}
