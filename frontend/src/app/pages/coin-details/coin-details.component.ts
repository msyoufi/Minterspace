import { Component, inject, signal, DestroyRef, Input } from '@angular/core';
import { CoingeckoService } from '../../shared/services/coingecko.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CoinDetailsHeaderComponent } from "./coin-details-header/coin-details-header.component";
import { CoinMarketDataComponent } from "./coin-market-data/coin-market-data.component";
import { CoinChartsComponent } from "./coin-charts/coin-charts.component";
import { ChartService } from './coin-charts/chart.service';
import { CoinDetailsLoaderComponent } from "./coin-details-loader/coin-details-loader.component";

import coinDetailsData from '../../shared/mock/coin-details.json';

@Component({
  selector: 'ms-coin-details',
  imports: [CoinDetailsHeaderComponent, CoinMarketDataComponent, CoinChartsComponent, CoinDetailsLoaderComponent],
  templateUrl: './coin-details.component.html',
  styleUrl: './coin-details.component.scss'
})
export class CoinDetailsComponent {
  coinService = inject(CoingeckoService);
  chartService = inject(ChartService);
  destroyRef = inject(DestroyRef);

  isLoading = signal<boolean>(true);
  coin = signal<CoinDetails | null>(null);

  @Input() set id(coinId: string) {
    this.getCoinData(coinId);
    this.chartService.getCoinCharts(coinId, 1);

    // this.coin.set(coinDetailsData);
    // this.isLoading.set(false);
  }

  getCoinData(coinId: string): void {
    this.isLoading.set(true);

    this.coinService.getCoinDetails(coinId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(coin => {
        this.coin.set(coin);
        this.isLoading.set(false);
      });
  }
}
