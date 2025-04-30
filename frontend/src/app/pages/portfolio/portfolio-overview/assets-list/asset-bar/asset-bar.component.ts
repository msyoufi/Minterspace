import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbsolutPipe } from '../../../../../shared/pipes/absolut.pipe';
import { SparklineComponent } from '../../../../../shared/components/sparkline.component';
import { MatTooltip } from '@angular/material/tooltip';
import { PortfolioService } from '../../../../../shared/services/portfolio.service';
import { ConfirmDialogService } from '../../../../../shared/components/confirm-dialog/confirm-dialog.service';
import { TransactionModalService } from '../../../../../shared/services/transaction-modal.service';
import { TransactionService } from '../../../../../shared/services/transaction.service';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';

@Component({
  selector: 'ms-asset-bar',
  imports: [CommonModule, RouterLink, AbsolutPipe, SparklineComponent, MatTooltip],
  templateUrl: './asset-bar.component.html',
  styleUrls: [
    './asset-bar.component.scss',
    '../assets-list.component.scss'
  ]
})
export class AssetBarComponent {
  portfolioService = inject(PortfolioService);
  transactionService = inject(TransactionService);
  transactionModalService = inject(TransactionModalService);
  confirmDialog = inject(ConfirmDialogService);
  snackbar = inject(SnackBarService);

  asset = input.required<Asset>();

  onAddClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    const portfolioId = this.getPortfolioId();
    if (!portfolioId) return;

    this.transactionModalService.openModal(portfolioId, this.asset().coin_id);
  }

  async onRemoveClick(event: MouseEvent): Promise<void> {
    event.stopPropagation();
    event.preventDefault();

    const confirm = await this.confirmDialog.open({
      title: 'Remove Asset',
      message: `Remove ${this.asset().name} and all its transactions from this portfolio?`,
      actionButton: 'Remove'
    });

    if (confirm)
      this.deleteAsset();
  }

  async deleteAsset(): Promise<void> {
    const portfolioId = this.getPortfolioId();
    if (!portfolioId) return;

    const { coin_id, name } = this.asset();

    const result = await this.transactionService.deleteAsset(portfolioId, coin_id);

    if (result)
      this.snackbar.show(`${name} Deleted`, 'green');
  }

  getPortfolioId(): number | bigint | undefined {
    return this.portfolioService.currentPortfolio$()?.id;
  }
}
