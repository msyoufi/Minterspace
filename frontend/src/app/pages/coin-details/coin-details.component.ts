import { Component, inject, signal, DestroyRef, Input } from '@angular/core';
import { CoingeckoService } from '../../shared/services/coingecko.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import coinDetailsData from '../../shared/mock/coin-details.json';
import { CoinDetailsHeaderComponent } from "./coin-details-header/coin-details-header.component";
import { CoinMarketDataComponent } from "./coin-market-data/coin-market-data.component";
import { CoinChartsComponent } from "./coin-charts/coin-charts.component";

@Component({
  selector: 'ms-coin-details',
  imports: [CoinDetailsHeaderComponent, CoinMarketDataComponent, CoinChartsComponent],
  templateUrl: './coin-details.component.html',
  styleUrl: './coin-details.component.scss'
})
export class CoinDetailsComponent {
  coinService = inject(CoingeckoService);
  destroyRef = inject(DestroyRef);

  isLoading = signal<boolean>(true);
  coin = signal<CoinDetails | null>(null);
  chartsData = signal<CoinCharts | null>(null);

  @Input() set id(coinId: string) {
    this.getCoinData(coinId);
    this.getCoinCharts(coinId);
  }

  getCoinData(coinId: string): void {
    this.isLoading.set(true);

    this.coinService.getCoinDetails(coinId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(coin => {
        this.coin.set(coin);
        this.isLoading.set(false);
      });

    // this.coin.set(coinDetailsData);
    // this.isLoading.set(false);
  }

  getCoinCharts(coinId: string): void {
    this.coinService.getCoinChartsData(coinId, '365')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(chartsData => this.chartsData.set(chartsData));
  }
}
