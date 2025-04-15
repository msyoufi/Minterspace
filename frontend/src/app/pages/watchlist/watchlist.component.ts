import { Component, inject, signal } from '@angular/core';
import { CoinsListComponent } from '../../shared/components/coins-list/coins-list.component';
import { WatchlistService } from '../../shared/services/watchlist.service';
import { WatchlistHeaderComponent } from './watchlist-header/watchlist-header.component';
import { WatchlistCoinSelectMenuComponent } from './watchlist-coin-select-menu/watchlist-coin-select-menu.component';
import coinsJson from '../../shared/mock/coins.json';

@Component({
  selector: 'ms-watchlist',
  imports: [CoinsListComponent, WatchlistHeaderComponent, WatchlistCoinSelectMenuComponent],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss'
})
export class WatchlistComponent {
  watchlistService = inject(WatchlistService);

  coins = signal<CoinBasic[]>([]);
  isCoinSelectMenuOpen = signal(false);
  isLoading = signal(false);
  loaderBarCount = 6;

  constructor() {
    this.coins.set(coinsJson.slice(0, 6));
  }

  openSelectMenu(): void {
    this.isCoinSelectMenuOpen.set(true);
  }

  onSelectMenuClose(): void {
    this.isCoinSelectMenuOpen.set(false);
  }
}
