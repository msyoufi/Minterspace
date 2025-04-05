import { ChangeDetectionStrategy, Component, ElementRef, input, OnDestroy, OnInit, viewChild } from '@angular/core';
import { ChartOptions, createChart, DeepPartial, IChartApi, UTCTimestamp, LineSeries } from "lightweight-charts";

interface SparklineData {
  time: UTCTimestamp,
  value: number
};

@Component({
  selector: 'ms-sparkline',
  imports: [],
  template: '<div #chartBox></div>',
  styles: `
    div {
      width: 10rem;
      height: 4.5rem;
      pointer-events: none;
      margin-left: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SparklineComponent implements OnInit, OnDestroy {
  priceData = input.required<number[]>();
  chartBoxRef = viewChild.required<ElementRef<HTMLDivElement>>('chartBox');

  chart: IChartApi | undefined;

  chartOptions: DeepPartial<ChartOptions> = {
    autoSize: false,
    layout: {
      background: { color: 'transparent' },
      attributionLogo: false,
    },
    timeScale: { visible: false },
    rightPriceScale: { visible: false },
    crosshair: { mode: 2 },
    grid: {
      vertLines: { visible: false },
      horzLines: { visible: false }
    }
  };

  ngOnInit(): void {
    if (!this.priceData().length) return;

    const chartData = this.mapToChartData();
    this.renderChart(chartData);
  }

  mapToChartData(): SparklineData[] {
    return this.priceData().map((price, index) => ({
      time: index as UTCTimestamp,
      value: price
    }));
  }

  ngOnDestroy(): void {
    this.chart?.remove();
  }

  renderChart(chartData: SparklineData[]): void {
    const chartColor = chartData[0].value > chartData[chartData.length - 1].value
      ? '#fe5e5e'
      : '#28c079';

    const chart = createChart(this.chartBoxRef().nativeElement, this.chartOptions);
    const lineSeries = chart.addSeries(LineSeries, {
      color: chartColor,
      lineWidth: 2,
      priceLineVisible: false
    });

    lineSeries.setData(chartData);
    chart.timeScale().fitContent();
  }
}
