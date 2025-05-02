import { effect, inject, Injectable, signal } from '@angular/core';
import { PortfolioService } from '../../shared/services/portfolio.service';

@Injectable()
export class PortfolioStateService {
  private portfolioService = inject(PortfolioService);

  public portfolioData$ = signal<PortfolioData | null>(null);

  get currentId(): number | bigint | null {
    return this.portfolioService.currentId;
  }

  constructor() {
    this.portfolioService.mustFetchNewData.set(true);
    effect(() => this.getPortfolioData());
  }

  async getPortfolioData(): Promise<void> {
    const portfolioId = this.portfolioService.currentPortfolio$()?.id;
    if (!portfolioId) return;

    if (!this.portfolioService.mustFetchNewData())
      return;

    const portfolioData = await this.portfolioService.fetchPortfolioData(portfolioId);
    if (!portfolioData) return;

    if ('assets' in portfolioData)
      this.portfolioData$.set(portfolioData);
    else
      this.portfolioData$.set(null);

    this.portfolioService.syncPortfolioCoins(portfolioData);

    this.portfolioService.mustFetchNewData.set(false);
  }
}