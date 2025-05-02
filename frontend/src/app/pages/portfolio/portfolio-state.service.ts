import { DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { PortfolioService } from '../../shared/services/portfolio.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class PortfolioStateService {
  private portfolioService = inject(PortfolioService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  public portfolioData$ = signal<PortfolioData | null>(null);

  get currentId(): number | bigint | null {
    return this.portfolioService.currentPortfolio$()?.id ?? null;
  }

  constructor() {
    this.subscribeToPortfolioData();
    effect(() => this.onDataFetching())
  }

  async subscribeToPortfolioData(): Promise<void> {
    this.portfolioService.fetchPortfolioDataObservable()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(portfolioData => {
        if ('assets' in portfolioData) {
          this.portfolioData$.set(portfolioData);

        } else {
          this.portfolioData$.set(null);
          this.router.navigateByUrl('/portfolio');
        }
      });
  }

  onDataFetching(): void {
    this.portfolioService.isFetching() && this.portfolioData$.set(null);
  }
}