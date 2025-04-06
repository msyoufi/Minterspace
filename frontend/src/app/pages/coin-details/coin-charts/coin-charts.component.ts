import { Component, input, OnChanges } from '@angular/core';

@Component({
  selector: 'ms-coin-charts',
  imports: [],
  templateUrl: './coin-charts.component.html',
  styleUrl: './coin-charts.component.scss'
})
export class CoinChartsComponent {
  chartsData = input.required<CoinCharts | null>();
}
