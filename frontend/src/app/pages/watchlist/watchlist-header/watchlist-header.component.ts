import { Component, effect, inject, input, signal } from '@angular/core';
import { WatchlistService } from '../../../shared/services/watchlist.service';
import { PerformancePaneComponent } from '../../../shared/components/performance-pane/performance-pane.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ms-watchlist-header',
  imports: [PerformancePaneComponent, RouterLink],
  templateUrl: './watchlist-header.component.html',
  styleUrl: './watchlist-header.component.scss'
})
export class WatchlistHeaderComponent {
  watchlistService = inject(WatchlistService);

  currentCoins = input.required<CoinBasic[]>();
  isLoading = input.required<boolean>();

  bestPerformer = signal<CoinBasic | null>(null);
  worstPerformer = signal<CoinBasic | null>(null);

  constructor() {
    effect(() => this.getPerformersCoins());
  }

  getPerformersCoins(): void {
    const coins = this.currentCoins();

    if (!coins.length) {
      this.bestPerformer.set(null);
      this.worstPerformer.set(null);
      return;
    }

    const sortedCoins = coins.slice().sort((a, b) =>
      b.price_change_percentage_24h - a.price_change_percentage_24h
    );

    this.bestPerformer.set(sortedCoins[0] ?? null);
    this.worstPerformer.set(sortedCoins[coins.length - 1] ?? null);
  }
}
