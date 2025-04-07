import { Injectable, DestroyRef, inject, OnDestroy, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UTCTimestamp, Time, TickMarkType, DeepPartial, ChartOptions, createChart, AreaSeries, IChartApi } from 'lightweight-charts';
import { CoingeckoService } from '../../../shared/services/coingecko.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService implements OnDestroy {
  coinService = inject(CoingeckoService);
  destroyRef = inject(DestroyRef);

  coinCharts$ = new BehaviorSubject<CoinCharts | null>(null);
  isLoading = signal(true);

  getCoinCharts(coinId: string, days: number): void {
    this.isLoading.set(true);

    this.coinService.getCoinChartsData(coinId, days)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(chartsData => this.coinCharts$.next(chartsData));
  }

  createChart(chartPane: HTMLDivElement, coinCharts: number[][]): IChartApi {
    const chartData = this.mapToChartData(coinCharts);
    return this.renderChart(chartPane, chartData);
  }

  mapToChartData(coinCharts: number[][]): ChartDataPoint[] {
    return coinCharts.map((dataPoint: number[]) => ({
      time: (dataPoint[0] / 1000) as UTCTimestamp,
      value: dataPoint[1]
    }));
  }

  renderChart(chartPane: HTMLDivElement, pricaData: ChartDataPoint[]): IChartApi {
    const color = pricaData[0].value > pricaData[pricaData.length - 1].value
      ? '#d1383f'
      : '#16C784';

    const areaOptions = {
      lineColor: color,
      topColor: `${color}90`,
      bottomColor: 'transparent',
      priceFormat: { minMove: 0.000000001 }
    };

    const chart = createChart(chartPane, this.chartOptions);
    const areaChart = chart.addSeries(AreaSeries, areaOptions);
    areaChart.applyOptions({ lineWidth: 2 });
    areaChart.setData(pricaData);
    chart.timeScale().fitContent();

    this.isLoading.set(false);

    return chart;
  }

  formatPrice(price: number): string {
    if (price >= 1000)
      price = Math.trunc(price);

    if (price <= 0)
      return '0.00';
    if (price >= 1000000000000)
      return (price / 1000000000000).toFixed(2) + 'T';
    if (price >= 1000000000)
      return (price / 1000000000).toFixed(1) + 'B';
    if (price >= 1000000)
      return (price / 1000000).toFixed(1) + 'M';
    if (price >= 1000)
      return price / 1000 + 'K';
    if (price >= 100)
      return price.toFixed(1);
    if (price >= 2)
      return price.toFixed(2);
    if (price >= 0.001)
      return price.toFixed(4);

    return price.toFixed(8);
  }

  formatTime(time: Time, tickMarkType: TickMarkType): string {
    const date = new Date((time as number) * 1000);

    switch (tickMarkType) {
      case 0:
        return date.getFullYear().toString();

      case 1: {
        const options: Intl.DateTimeFormatOptions = { month: 'short', year: '2-digit' };
        return new Intl.DateTimeFormat('en', options).format(date);
      }

      case 2: {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
        return new Intl.DateTimeFormat('en', options).format(date);
      }

      case 3:
      case 4: {
        const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        return new Intl.DateTimeFormat('en', options).format(date);
      }

      default:
        return '';
    }
  }

  chartOptions: DeepPartial<ChartOptions> = {
    autoSize: true,
    layout: {
      background: { color: 'transparent' },
      fontSize: 16,
      textColor: '#878787',
      attributionLogo: false
    },
    timeScale: {
      fixLeftEdge: true,
      fixRightEdge: true,
      lockVisibleTimeRangeOnResize: true,
      timeVisible: true,
      borderVisible: false,
      tickMarkFormatter: (time: Time, tickMarkType: TickMarkType) => this.formatTime(time, tickMarkType)
    },
    rightPriceScale: {
      borderVisible: false
    },
    grid: {
      vertLines: {
        visible: false
      },
      horzLines: {
        color: '#757a8330'
      }
    },
    crosshair: {
      vertLine: {
        labelBackgroundColor: '#202b41'
      },
      horzLine: {
        labelBackgroundColor: '#202b41'
      }
    },
    localization: {
      priceFormatter: (price: number) => this.formatPrice(price)
    }
  };

  cleanCoinCharts(): void {
    this.coinCharts$.next(null);
  }

  ngOnDestroy(): void {
    this.cleanCoinCharts();
  }
}