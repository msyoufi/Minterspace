import { Component, computed, inject, input, signal } from '@angular/core';
import { WatchlistService } from '../services/watchlist.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'ms-watchlist-star',
  imports: [MatTooltip, MatProgressSpinner],
  template: `
    <div>
      @if(isLoading()) {
      <mat-spinner [diameter]="20" [strokeWidth]="2" />
      } @else {
      <button class="icon-button" (click)="onStarClick($event)"
        [matTooltip]="(isInWatchlist() ? 'Remove From ' : 'Add To ') + relevantWatchlist()?.name + ' Watchlist'">
        <i [class]="'bi bi-star' + (isInWatchlist() ? '-fill' : '')"></i>
      </button>
      }
    </div>
  `,
  styles: ` 
    div {
      text-align: center;
    }
  `
})
export class WatchlistStarComponent {
  watchlistService = inject(WatchlistService);
  router = inject(Router);

  relevantWatchlist = this.router.url.includes('watchlist')
    ? this.watchlistService.currentWatchlist$
    : this.watchlistService.mainWatchlist;

  coinId = input.required<string>();
  isInWatchlist = computed(() => this.relevantWatchlist()?.coins.includes(this.coinId()));

  isLoading = signal(false);

  onStarClick(e: MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();

    const watchlist = this.relevantWatchlist();

    if (!watchlist) return;

    this.updateWatchlistCoins(watchlist);
  }

  async updateWatchlistCoins(watchlist: Watchlist): Promise<void> {
    this.isLoading.set(true);

    const coins = this.isInWatchlist()
      ? watchlist.coins.filter(id => id !== this.coinId())
      : [...watchlist.coins, this.coinId()];

    await this.watchlistService.updateWatchlist(this.relevantWatchlist()!.id, { coins });
    
    this.isLoading.set(false);
  }
}
