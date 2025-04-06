import { Component, inject, signal, DestroyRef, Input } from '@angular/core';
import { CoingeckoService } from '../../shared/services/coingecko.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import coinDetailsData from '../../shared/mock/coin-details.json';

@Component({
  selector: 'ms-coin-details',
  imports: [],
  templateUrl: './coin-details.component.html',
  styleUrl: './coin-details.component.scss'
})
export class CoinDetailsComponent {
  coinService = inject(CoingeckoService);
  destroyRef = inject(DestroyRef);

  isLoading = signal<boolean>(true);
  coin = signal<CoinDetails | null>(null);

  @Input() set id(coinId: string) {
    console.log(coinId)
    this.getCoinData(coinId);
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
}
