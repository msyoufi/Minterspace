import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'ms-watchlist-header',
  imports: [],
  templateUrl: './watchlist-header.component.html',
  styleUrl: './watchlist-header.component.scss'
})
export class WatchlistHeaderComponent {
  addCoinClick = output<void>();

  onAddCoinClicked(): void {
    this.addCoinClick.emit();
  }
}
