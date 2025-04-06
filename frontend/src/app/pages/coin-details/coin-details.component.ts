import { Component, inject, signal, DestroyRef } from '@angular/core';
import { CoingeckoService } from '../../shared/services/coingecko.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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


  constructor() {
    this.getCoinData();
  }

  getCoinData(): void {
    this.isLoading.set(true);

    this.coinService.getCoinDetails('bitcoin')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(coin => {
        console.log(coin)
      });

    // this.coin.set(null);
    // this.isLoading.set(false);
  }
}
