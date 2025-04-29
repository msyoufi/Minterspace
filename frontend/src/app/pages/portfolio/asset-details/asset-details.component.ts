import { Component, effect, inject, Input, signal } from '@angular/core';
import { PortfolioService } from '../../../shared/services/portfolio.service';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { AssetPanesComponent } from './asset-panes/asset-panes.component';

@Component({
  selector: 'ms-asset-details',
  imports: [TransactionsListComponent, AssetPanesComponent],
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.scss'
})
export class AssetDetailsComponent {
  portfolioService = inject(PortfolioService);

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

    const portfolioData = this.portfolioService.currentPortfolioData$();
    if (!portfolioData) return;

    const { assets, transactions_by_coin } = portfolioData;

    const asset = assets.find(ast => ast.coin_id === coinId) ?? null;
    const transactions = transactions_by_coin[coinId];

    this.asset.set(asset);
    this.transactions.set(transactions);
  }
}
