import { inject, Injectable, signal } from '@angular/core';
import { CoingeckoService } from './coingecko.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionModalService {
  private coinService = inject(CoingeckoService);

  public isModalOpen$ = signal<boolean>(false);
  public selectedCoin = signal<CoinBasic | null>(null);

  openModal(coinId: string): void {
    this.getCoinData(coinId);
    this.isModalOpen$.set(true);
  }

  closeModal(): void {
    this.isModalOpen$.set(false);
    this.selectedCoin.set(null);
  }

  async getCoinData(coinId: string): Promise<void> {
    const params = { ids: coinId };

    const coin = await this.coinService.getCoinsList(params);
    this.selectedCoin.set(coin[0] ?? null);

    console.log(coin);
  }
}
