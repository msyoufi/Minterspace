import { Component, input, output } from '@angular/core';
import { MiniCoinBarComponent } from './mini-coin-bar/mini-coin-bar.component';

@Component({
  selector: 'ms-mini-coins-list',
  imports: [MiniCoinBarComponent],
  templateUrl: './mini-coins-list.component.html',
  styleUrl: './mini-coins-list.component.scss'
})
export class MiniCoinsListComponent {
  coins = input.required<(CoinBasic | CoinSearch | CoinTrending)[]>();
  isLoading = input.required<boolean>();

  coinBarClick = output<CoinBasic | CoinSearch | CoinTrending>();

  onCoinBarClick(coin: CoinBasic | CoinSearch | CoinTrending): void {
    this.coinBarClick.emit(coin);
  }
}
