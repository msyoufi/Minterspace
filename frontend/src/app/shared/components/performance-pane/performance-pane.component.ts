import { CommonModule } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import { AbsolutPipe } from '../../pipes/absolut.pipe';
import { SparklineComponent } from '../sparkline.component';

@Component({
  selector: 'ms-performance-pane',
  imports: [CommonModule, AbsolutPipe, SparklineComponent],
  templateUrl: './performance-pane.component.html',
  styles: `
  .image-name-container {
    display: flex;
    align-items: center;
    margin: .25rem 0;
    column-gap: .5rem;
  }

  .sparkline-container .title {
    margin-bottom: 1.5rem;
    text-align: center;
  }

  @media (max-width: 450px) {
    .sparkline-container {
      display: none;
    }
  }
`
})
export class PerformancePaneComponent {
  coin = input.required<CoinBasic | Asset>();
  withSparkline = input<boolean>(false);

  valueChange: number = 0;
  valueChangePercent: number = 0;
  sparkline: number[] = [];

  constructor() {
    effect(() => this.onCoinChange());
  }

  onCoinChange(): void {
    const coin = this.coin();
    if (!coin) return;

    if ('coin_id' in coin) {
      this.valueChange = coin.profit_loss;
      this.valueChangePercent = coin.profit_loss_percentage;

      if (this.withSparkline())
        this.sparkline = coin.sparkline;

    } else {
      this.valueChange = coin.price_change_24h;
      this.valueChangePercent = coin.price_change_percentage_24h;

      if (this.withSparkline())
        this.sparkline = coin.sparkline_in_7d.price;
    }
  }
}
