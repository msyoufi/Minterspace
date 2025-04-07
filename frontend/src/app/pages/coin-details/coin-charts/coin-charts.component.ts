import { Component, DestroyRef, effect, ElementRef, inject, input, OnDestroy, viewChild } from '@angular/core';
import { IChartApi } from 'lightweight-charts';
import { ChartService } from './chart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'ms-coin-charts',
  imports: [],
  templateUrl: './coin-charts.component.html',
  styleUrl: './coin-charts.component.scss'
})
export class CoinChartsComponent implements OnDestroy {
  chartService = inject(ChartService);
  destroyRef = inject(DestroyRef);

  coinId = input.required<string>();
  chartPane = viewChild.required<ElementRef<HTMLDivElement>>('chartPane');

  chart: IChartApi | undefined;
  chartType: 'prices' | 'market_caps' = 'prices';
  chartDays = 1;

  constructor() {
    effect(() => this.subscribeToCoinCharts())
  }

  subscribeToCoinCharts(): void {
    this.chartService.coinCharts$
      .pipe(
        filter(data => !!data),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(coinChartsData => this.createChart(coinChartsData));
  }

  createChart(coinChartsData: CoinCharts): void {
    this.chart?.remove();
    this.chart = this.chartService.createChart(this.chartPane().nativeElement, coinChartsData[this.chartType]);
  }

  onChartTypeChange(type: 'prices' | 'market_caps'): void {
    const coinChartsData = this.chartService.coinCharts$.getValue();

    if (!coinChartsData) return;

    this.chartType = type;
    this.createChart(coinChartsData);
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