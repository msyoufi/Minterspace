import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { AbsolutPipe } from '../../../shared/pipes/absolut.pipe';
import { WatchlistStarComponent } from '../../../shared/components/watchlist-star.component';
import { TransactionModalService } from '../../../shared/services/transaction-modal.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'ms-coin-details-header',
  imports: [CommonModule, AbsolutPipe, WatchlistStarComponent, MatTooltip],
  templateUrl: './coin-details-header.component.html',
  styleUrl: './coin-details-header.component.scss'
})
export class CoinDetailsHeaderComponent {
  transactionModalService = inject(TransactionModalService);

  coin = input.required<CoinDetails>();

  openTransactionModal(): void {
    this.transactionModalService.openModal(this.coin().id);
  }
}
