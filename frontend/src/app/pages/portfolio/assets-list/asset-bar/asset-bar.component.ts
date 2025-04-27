import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbsolutPipe } from '../../../../shared/pipes/absolut.pipe';
import { SparklineComponent } from '../../../../shared/components/sparkline.component';
import { MatTooltip } from '@angular/material/tooltip';
import { PortfolioService } from '../../../../shared/services/portfolio.service';
import { ConfirmDialogService } from '../../../../shared/components/confirm-dialog/confirm-dialog.service';

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
  confirmDialog = inject(ConfirmDialogService);

  asset = input.required<Asset>();
  addTranxClick = output<string>();

  onAddClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    this.addTranxClick.emit(this.asset().coin_id);
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
    // TODO
  }
}
