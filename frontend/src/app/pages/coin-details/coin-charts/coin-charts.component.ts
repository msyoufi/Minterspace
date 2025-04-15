import { Component, effect, ElementRef, inject, input, OnDestroy, viewChild } from '@angular/core';
import { IChartApi } from 'lightweight-charts';
import { ChartService } from './chart.service';

@Component({
  selector: 'ms-coin-charts',
  imports: [],
  templateUrl: './coin-charts.component.html',
  styleUrl: './coin-charts.component.scss'
})
export class CoinChartsComponent implements OnDestroy {
  chartService = inject(ChartService);

  coinId = input.required<string>();
  chartPane = viewChild.required<ElementRef<HTMLDivElement>>('chartPane');

  chart: IChartApi | undefined;
  chartType: 'prices' | 'market_caps' = 'prices';
  chartDays = 1;

  constructor() {
    this.onChartsDataChange();
  }

  onChartsDataChange(): void {
    effect(() => {
      const chartsData = this.chartService.coinCharts$();
      chartsData && this.createChart(chartsData);
    });
  }

  createChart(coinChartsData: CoinCharts): void {
    this.chart?.remove();
    this.chart = this.chartService.createChart(this.chartPane().nativeElement, coinChartsData[this.chartType]);
  }

  onChartTypeChange(type: 'prices' | 'market_caps'): void {
    const chartsData = this.chartService.coinCharts$();

    if (!chartsData) return;

    this.chartType = type;
    this.createChart(chartsData);
  }

  onChartDaysChange(days: number): void {
    this.chartDays = days;
    this.chartService.getCoinCharts(this.coinId(), days);
  }

  ngOnDestroy(): void {
    this.chart?.remove();
    this.chartService.cleanCoinCharts();
  }
}