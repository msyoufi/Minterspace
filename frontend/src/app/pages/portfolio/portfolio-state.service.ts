import { effect, inject, Injectable, signal } from '@angular/core';
import { PortfolioService } from '../../shared/services/portfolio.service';
import { Router } from '@angular/router';

@Injectable()
export class PortfolioStateService {
  private portfolioService = inject(PortfolioService);
  router = inject(Router);

  public portfolioData$ = signal<PortfolioData | null>(null);

  get currentId(): number | bigint | null {
    return this.portfolioService.currentPortfolioId$();
  }

  constructor() {
    this.portfolioService.mustFetchNewData.set(true);
    effect(() => this.getPortfolioData());
  }

  async getPortfolioData(): Promise<void> {
    if (!this.portfolioService.mustFetchNewData())
      return;

    const portfolioId = this.currentId;
    if (!portfolioId) return;

    this.portfolioData$.set(null);

    const portfolioData = await this.portfolioService.fetchPortfolioData(portfolioId);
    if (!portfolioData) return;

    console.log(portfolioData)

    if ('assets' in portfolioData) {
      this.portfolioData$.set(portfolioData);

    } else {
      this.portfolioData$.set(null);
      this.router.navigateByUrl('/portfolio');
    }

    this.portfolioService.syncPortfolioCoins(portfolioData);
    this.portfolioService.mustFetchNewData.set(false);
  }
}