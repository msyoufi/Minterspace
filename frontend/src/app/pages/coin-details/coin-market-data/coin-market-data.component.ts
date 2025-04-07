import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'ms-coin-market-data',
  imports: [CommonModule],
  templateUrl: './coin-market-data.component.html',
  styleUrl: './coin-market-data.component.scss'
})
export class CoinMarketDataComponent {
  coin = input.required<CoinDetails>();

}
