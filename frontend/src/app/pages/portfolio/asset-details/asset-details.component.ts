import { Component, effect, inject, Input, signal } from '@angular/core';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { AssetPanesComponent } from './asset-panes/asset-panes.component';
import { TransactionModalService } from '../../../shared/services/transaction-modal.service';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { PortfolioStateService } from '../portfolio-state.service';

@Component({
  selector: 'ms-asset-details',
  imports: [TransactionsListComponent, AssetPanesComponent, RouterLink, MatTooltip],
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.scss'
})
export class AssetDetailsComponent {
  portfolioState = inject(PortfolioStateService);
  transactionModalService = inject(TransactionModalService);

  coinId = signal<string>('');
  asset = signal<Asset | null>(null);
  transactions = signal<Transaction[]>([]);

  @Input() set id(coinId: string) {
    this.coinId.set(coinId);
  }

  constructor() {
    effect(() => this.getAssetData(this.coinId()));
  }

  getAssetData(coinId: string): void {
    if (!coinId) return;

    const portfolioData = this.portfolioState.portfolioData$();
    if (!portfolioData) return;

    const { assets, transactions_by_coin } = portfolioData;

    const asset = assets.find(ast => ast.coin_id === coinId) ?? null;
    const transactions = transactions_by_coin[coinId];

    this.asset.set(asset);
    this.transactions.set(transactions);
  }

  openTransactionModal(coinId: string): void {
    const portfolioId = this.portfolioState.currentId;
    if (!portfolioId) return;

    this.transactionModalService.openModal(portfolioId, coinId);
  }
}
