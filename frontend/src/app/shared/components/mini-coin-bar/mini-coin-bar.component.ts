import { Component, input } from '@angular/core';

@Component({
  selector: 'ms-mini-coin-bar',
  imports: [],
  templateUrl: './mini-coin-bar.component.html',
  styleUrl: './mini-coin-bar.component.scss'
})
export class MiniCoinBarComponent {
  coin = input.required<CoinBasic | CoinSearch | CoinTrending>();
  imgURL: string = '';

  ngOnInit(): void {
    const coin = this.coin();

    if ('image' in coin)
      this.imgURL = coin.image;

    if ('thumb' in coin)
      this.imgURL = coin.thumb;
  }
}
