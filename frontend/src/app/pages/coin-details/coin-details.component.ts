import { Component, inject, signal, Input } from '@angular/core';
import { CoingeckoService } from '../../shared/services/coingecko.service';
import { CoinDetailsHeaderComponent } from "./coin-details-header/coin-details-header.component";
import { CoinMarketDataComponent } from "./coin-market-data/coin-market-data.component";
import { CoinChartsComponent } from "./coin-charts/coin-charts.component";
import { ChartService } from './coin-charts/chart.service';
import { CoinDetailsLoaderComponent } from "./coin-details-loader/coin-details-loader.component";

@Component({
  selector: 'ms-coin-details',
  imports: [CoinDetailsHeaderComponent, CoinMarketDataComponent, CoinChartsComponent, CoinDetailsLoaderComponent],
  templateUrl: './coin-details.component.html',
  styleUrl: './coin-details.component.scss'
})
export class CoinDetailsComponent {
  coinService = inject(CoingeckoService);
  chartService = inject(ChartService);

  coin = signal<CoinDetails | null>(null);
  isLoading = signal(false);

  @Input() set id(coinId: string) {
    this.getCoinData(coinId);
    this.chartService.getCoinCharts(coinId, 1);
  }

  async getCoinData(coinId: string): Promise<void> {
    this.isLoading.set(true);

    const coin = await this.coinService.getCoinDetails(coinId);
    this.coin.set(coin);

    this.isLoading.set(false);
  }
}
