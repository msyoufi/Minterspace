import { Component, effect, inject, input, signal } from '@angular/core';
import { LabelButtonComponent } from '../../../../shared/components/label-button.component';
import { CommonModule } from '@angular/common';
import { TransactionModalService } from '../../../../shared/services/transaction-modal.service';
import { MatTooltip } from '@angular/material/tooltip';
import { PortfolioService } from '../../../../shared/services/portfolio.service';

@Component({
  selector: 'ms-transactions-list',
  imports: [LabelButtonComponent, CommonModule, MatTooltip],
  templateUrl: './transactions-list.component.html',
  styleUrl: './transactions-list.component.scss'
})
export class TransactionsListComponent {
  portfolioService = inject(PortfolioService);
  transactionModal = inject(TransactionModalService);

  transactions = input.required<Transaction[]>();
  assetSymbol = input.required<string>();

  sortKey = signal<TransactionSortKey>('');
  isAscOrder = signal<boolean>(true);

  constructor() {
    effect(() => this.sortTransactions());
  }

  sortTransactions(): void {
    const sortKey = this.sortKey();
    if (!sortKey) return;

    if (sortKey === 'date') {
      this.isAscOrder()
        ? this.transactions().sort((a, b) => a[sortKey].localeCompare(b[sortKey]))
        : this.transactions().sort((a, b) => b[sortKey].localeCompare(a[sortKey]));

    } else {
      this.isAscOrder()
        ? this.transactions().sort((a, b) => a[sortKey] - b[sortKey])
        : this.transactions().sort((a, b) => b[sortKey] - a[sortKey]);
    }
  }

  onSortLabelClick(sortKey: TransactionSortKey): void {
    const isNewAscOrder = sortKey === this.sortKey() && this.isAscOrder()
      ? false
      : true;

    this.sortKey.set(sortKey);
    this.isAscOrder.set(isNewAscOrder)
  }


  onRemoveClick(tranxId: number | bigint): void {
    // TODO
    console.log(tranxId)
  }

  labels: { content: string, sortKey: TransactionSortKey }[] = [
    {
      content: 'Type / Date & Time',
      sortKey: 'date'
    }, {
      content: 'Price',
      sortKey: 'coin_price_usd'
    }, {
      content: 'Value / Quantity',
      sortKey: 'quantity'
    }, {
      content: '',
      sortKey: ''
    }
  ];
}
