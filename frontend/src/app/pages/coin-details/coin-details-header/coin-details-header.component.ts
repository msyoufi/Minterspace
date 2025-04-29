import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { AbsolutPipe } from '../../../shared/pipes/absolut.pipe';
import { WatchlistStarComponent } from '../../../shared/components/watchlist-star.component';
import { TransactionModalService } from '../../../shared/services/transaction-modal.service';
import { MatTooltip } from '@angular/material/tooltip';
import { PortfolioService } from '../../../shared/services/portfolio.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'ms-coin-details-header',
  imports: [CommonModule, AbsolutPipe, WatchlistStarComponent, MatTooltip],
  templateUrl: './coin-details-header.component.html',
  styleUrl: './coin-details-header.component.scss'
})
export class CoinDetailsHeaderComponent {
  authService = inject(AuthService);
  portfolioService = inject(PortfolioService);
  transactionModalService = inject(TransactionModalService);

  coin = input.required<CoinDetails>();

  onAddTransactionClick(): void {
    if (!this.authService.user$())
      return this.authService.openAuthModal('/portfolio');
    else
      this.openTransactionModal();
  }

  openTransactionModal(): void {
    const portfolioId = this.portfolioService.mainPortfolio()?.id;
    if (!portfolioId) return;

    this.transactionModalService.openModal(portfolioId, this.coin().id);
  }
}
