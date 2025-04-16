import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbsolutPipe } from '../../../shared/pipes/absolut.pipe';
import { WatchlistStarComponent } from '../../../shared/components/watchlist-star.component';

@Component({
  selector: 'ms-coin-details-header',
  imports: [CommonModule, AbsolutPipe, WatchlistStarComponent],
  templateUrl: './coin-details-header.component.html',
  styleUrl: './coin-details-header.component.scss'
})
export class CoinDetailsHeaderComponent {
  coin = input.required<CoinDetails>();
}
