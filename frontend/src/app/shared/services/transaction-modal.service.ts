import { inject, Injectable, signal } from '@angular/core';
import { CoingeckoService } from './coingecko.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionModalService {
  private coinService = inject(CoingeckoService);

  public isModalOpen$ = signal<boolean>(false);
  public selectedCoin = signal<CoinBasic | null>(null);
  public selectedPortfolioId = signal<number | bigint | null>(null);

  openModal(portfolioId: number | bigint, coinId: string): void {
    this.setSelectedCoin(coinId);
    this.selectedPortfolioId.set(portfolioId);
    this.isModalOpen$.set(true);
  }

  closeModal(): void {
    this.isModalOpen$.set(false);
    this.selectedCoin.set(null);
    this.selectedPortfolioId.set(null);
  }

  async setSelectedCoin(coinId: string): Promise<void> {
    const coin = await this.getCoinData(coinId);
    this.selectedCoin.set(coin);
  }

  async getCoinData(coinId: string): Promise<CoinBasic | null> {
    const params = { ids: coinId };
    const coins = await this.coinService.getCoinsList(params);

    return coins[0] ?? null;
  }
}