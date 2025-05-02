import { Component, effect, inject, input, signal } from '@angular/core';
import { LabelButtonComponent } from '../../../../shared/components/label-button.component';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { TransactionService } from '../../../../shared/services/transaction.service';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import { ConfirmDialogService } from '../../../../shared/components/confirm-dialog/confirm-dialog.service';
import { PortfolioService } from '../../../../shared/services/portfolio.service';

@Component({
  selector: 'ms-transactions-list',
  imports: [LabelButtonComponent, CommonModule, MatTooltip],
  templateUrl: './transactions-list.component.html',
  styleUrl: './transactions-list.component.scss'
})
export class TransactionsListComponent {
  portfolioService = inject(PortfolioService);
  transactionService = inject(TransactionService);
  confirmDialog = inject(ConfirmDialogService);
  snackbar = inject(SnackBarService);

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

  async onRemoveClick(transactionId: number | bigint): Promise<void> {
    const confirm = await this.confirmDialog.open({
      title: 'Delete Transaction',
      message: 'Delete this transaction permanently?',
      actionButton: 'Delete'
    });

    if (!confirm) return;

    const portfolioId = this.transactions().find(trx => trx.id === transactionId)!.portfolio_id;
    this.deleteTransaction(portfolioId, transactionId);
  }

  async deleteTransaction(portfolioId: number | bigint, transactionId: number | bigint): Promise<void> {
    const result = await this.transactionService.deleteTransaction(portfolioId, transactionId);
    if (!result) return;

    this.portfolioService.getPortfolioDataById(portfolioId);
    this.snackbar.show('Transaction Deleted', 'green');
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
