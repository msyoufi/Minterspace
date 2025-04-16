import { Component, computed, effect, inject, signal } from '@angular/core';
import { CoinsListComponent } from '../../shared/components/coins-list/coins-list.component';
import { WatchlistService } from '../../shared/services/watchlist.service';
import { WatchlistHeaderComponent } from './watchlist-header/watchlist-header.component';
import { WatchlistCoinSelectMenuComponent } from './watchlist-coin-select-menu/watchlist-coin-select-menu.component';
import { CoingeckoService } from '../../shared/services/coingecko.service';
import { WatchlistControlBarComponent } from './watchlist-control-bar/watchlist-control-bar.component';

@Component({
  selector: 'ms-watchlist',
  imports: [CoinsListComponent, WatchlistHeaderComponent, WatchlistCoinSelectMenuComponent, WatchlistControlBarComponent],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss'
})
export class WatchlistComponent {
  watchlistService = inject(WatchlistService);
  coinService = inject(CoingeckoService);

  currentCoins = signal<CoinBasic[]>([]);
  isCoinSelectMenuOpen = signal(false);
  isLoading = signal(false);

  loaderBarCount = computed<number>(() =>
    this.watchlistService.currentWatchlist$()?.coins.length ?? 0
  );

  constructor() {
    this.onWatchlistChange();
  }

  async onWatchlistChange(): Promise<void> {
    effect(async () => {
      const watchlist = this.watchlistService.currentWatchlist$();

      if (!watchlist || !watchlist.coins.length) {
        this.currentCoins.set([]);
        return;
      }

      this.getCoinsData(watchlist);
    });
  }

  async getCoinsData(watchlist: Watchlist): Promise<void> {
    this.isLoading.set(true);
    const params = {
      ids: watchlist.coins.join(','),
      sparkline: true
    };

    const coins = await this.coinService.getCoinsList(params);

    this.currentCoins.set(coins);
    this.isLoading.set(false);
  }

  openSelectMenu(): void {
    this.isCoinSelectMenuOpen.set(true);
  }

  onSelectMenuClose(): void {
    this.isCoinSelectMenuOpen.set(false);
  }
}
