import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { WatchlistService } from '../services/watchlist.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SnackBarService } from '../services/snack-bar.service';

@Component({
  selector: 'ms-watchlist-star',
  imports: [MatTooltip, MatProgressSpinner],
  template: `
    <div>
      @if(isLoading()) {
      <mat-spinner [diameter]="15" [strokeWidth]="2" />

      } @else {
      <button class="icon-button" (click)="onStarClick($event)"
        [matTooltip]="tooltip()">
        <i [class]="'bi bi-star' + (isInWatchlist() ? '-fill' : '')"></i>
      </button>
      }
    </div>
  `,
  styles: ` 
    div {
      text-align: center;
    }
    
    .bi-star {
      color: var(--gray);
      &:hover {
        color: gold;
      }
    }
  `
})
export class WatchlistStarComponent {
  authService = inject(AuthService);
  watchlistService = inject(WatchlistService);
  snackbar = inject(SnackBarService);
  router = inject(Router);

  coinId = input.required<string>();

  contextWatchlist = this.router.url.includes('watchlist')
    ? this.watchlistService.currentWatchlist$
    : this.watchlistService.mainWatchlist;

  isInWatchlist = computed(() => !!this.contextWatchlist()?.coins.includes(this.coinId()));
  tooltip = signal('');
  isLoading = signal(false);

  constructor() {
    effect(() => this.setTooltip());
  }

  setTooltip(): void {
    const user = this.authService.user$();
    const watchlist = this.contextWatchlist();
    let content = 'Add To Watchlist';

    if (user && watchlist) {
      content = (this.isInWatchlist() ? 'Remove From ' : 'Add To ')
        + (watchlist.is_main ? 'Main' : 'this')
        + ' Watchlist';
    }

    this.tooltip.set(content);
  }

  onStarClick(e: MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();

    if (!this.authService.user$())
      return this.authService.openAuthModal('/watchlist');
    else
      this.updateWatchlistCoins();
  }

  async updateWatchlistCoins(): Promise<void> {
    const watchlist = this.contextWatchlist();
    if (!watchlist) return;

    this.isLoading.set(true);

    const coins = this.isInWatchlist()
      ? watchlist.coins.filter(id => id !== this.coinId())
      : [...watchlist.coins, this.coinId()];

    await this.watchlistService.updateWatchlist(watchlist.id, { coins });

    this.isLoading.set(false);
    this.showSuccessMessage();
  }

  showSuccessMessage(): void {
    const message = (this.isInWatchlist()
      ? 'Added To '
      : 'Removed From '
    ) + this.contextWatchlist()!.name;

    this.snackbar.show(message, 'green');
  }
}
