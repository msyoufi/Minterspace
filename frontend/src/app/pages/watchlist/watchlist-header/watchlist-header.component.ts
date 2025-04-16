import { Component, inject, output } from '@angular/core';
import { WatchlistService } from '../../../shared/services/watchlist.service';

@Component({
  selector: 'ms-watchlist-header',
  imports: [],
  templateUrl: './watchlist-header.component.html',
  styleUrl: './watchlist-header.component.scss'
})
export class WatchlistHeaderComponent {
  watchlistService = inject(WatchlistService);

  addCoinClick = output<void>();

  onAddCoinClick(): void {
    this.addCoinClick.emit();
  }
}
