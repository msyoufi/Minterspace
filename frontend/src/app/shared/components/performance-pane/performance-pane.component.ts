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
  coin = input.required<CoinBasic>();

  valueChange: number = 0;
  valueChangePercent: number = 0;

  constructor() {
    effect(() => this.onCoinChange());
  }

  onCoinChange(): void {
    const coin = this.coin();
    if (!coin) return;

    this.valueChange = coin.price_change_24h;
    this.valueChangePercent = coin.price_change_percentage_24h;
  }
}
