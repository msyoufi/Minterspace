import { Component, effect, ElementRef, input, OnDestroy, viewChild } from '@angular/core';
import * as echarts from 'echarts/core';
import { type EChartsCoreOption, type ECharts, init } from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent, LegendComponent, DatasetComponent } from 'echarts/components'


echarts.use([PieChart, CanvasRenderer, TooltipComponent, LegendComponent, DatasetComponent]);

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
  chartData = input.required<AllocationChartDataPoint[]>();

  chartContainer = viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');
  chart: ECharts | undefined;

  constructor() {
    effect(() => this.drawChart(this.chartData()));
  }

  drawChart(chartData: AllocationChartDataPoint[]): void {
    this.chart?.dispose();

    this.chartOptions['dataset'] = { source: chartData };
    this.chart = init(this.chartContainer().nativeElement);
    this.chart.setOption(this.chartOptions);
  }

  onWindowResize(): void {
    this.chart?.resize();
  }

  ngOnDestroy(): void {
    this.chart?.dispose();
  }

  chartOptions: EChartsCoreOption = {
    tooltip: {
      trigger: 'item',
      formatter: function (params: any) {
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
