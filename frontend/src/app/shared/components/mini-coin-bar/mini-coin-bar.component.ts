import { CommonModule } from '@angular/common';
import { Component, input, output, TemplateRef } from '@angular/core';

@Component({
  selector: 'ms-mini-coin-bar',
  imports: [CommonModule],
  templateUrl: './mini-coin-bar.component.html',
  styleUrl: './mini-coin-bar.component.scss'
})
export class MiniCoinBarComponent {
  coin = input.required<CoinBasic | CoinSearch | CoinTrending>();
  icon = input<TemplateRef<unknown>>();

  coinBarClick = output<CoinBasic | CoinSearch | CoinTrending>();
  imgUrl: string = '';

  ngOnInit(): void {
    const coin = this.coin();
    this.imgUrl = 'image' in coin ? coin.image : coin.thumb;
  }

  onCoinBarClick(coin: CoinBasic | CoinSearch | CoinTrending): void {
    this.coinBarClick.emit(coin);
  }
}
