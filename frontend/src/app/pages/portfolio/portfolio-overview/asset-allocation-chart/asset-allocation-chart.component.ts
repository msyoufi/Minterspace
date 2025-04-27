import { Component, effect, ElementRef, inject, OnDestroy, viewChild } from '@angular/core';
import { ECharts, EChartsOption, init } from 'echarts';
import { PortfolioService } from '../../../../shared/services/portfolio.service';

@Component({
  selector: 'ms-asset-allocation-chart',
  imports: [],
  template: '<div aria-label="Doughnut Chart Crypto Asset Allocation" role="img" #chartContainer></div>',
  styles: `
  div {
    width: 100%;
    height: 270px;
  }`,
  host: {
    '(window:resize)': 'onWindowResize()'
  }
})
export class AssetAllocationChartComponent implements OnDestroy {
  portfolioService = inject(PortfolioService);

  chartContainer = viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');
  chart: ECharts | undefined;

  constructor() {
    effect(() => this.onChartDataChange());
  }

  onChartDataChange(): void {
    const chartData = this.portfolioService.currentPortfolioData$()?.allocation_chart;
    if (!chartData) return;

    this.drawChart(chartData);
  }

  drawChart(chartData: AllocationChartDataPoint[]): void {
    this.chart?.dispose();

    this.chartOptions.dataset = { source: chartData };
    this.chart = init(this.chartContainer().nativeElement);
    this.chart.setOption(this.chartOptions);
  }

  onWindowResize(): void {
    this.chart?.resize();
  }

  ngOnDestroy(): void {
    this.chart?.dispose();
  }

  chartOptions: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        //@ts-ignore
        const { marker, name, value, percent } = params;
        const inCurrency = value.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        return `
          ${marker} <b>${name}</b><br/>
          <b>${inCurrency}</b> | <b>${Math.round(percent)}%</b>
        `;
      }
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      icon: 'circle',
      left: 21,
      top: 60,
      textStyle: {
        color: 'var'
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['80%', '60%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderWidth: 0
        },
        label: {
          show: false,
        }
      }
    ]
  };
}
