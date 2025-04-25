import { Component, inject, signal } from '@angular/core';
import { NameInputPaneComponent } from '../../../shared/components/name-input-pane/name-input-pane.component';
import { PortfolioService } from '../../../shared/services/portfolio.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { TransactionModalService } from '../../../shared/services/transaction-modal.service';
import { EscapePressDirective } from '../../../shared/directives/escape-press.directive';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'ms-portfolio-control-bar',
  imports: [NameInputPaneComponent, EscapePressDirective, ClickOutsideDirective, MatTooltip],
  templateUrl: './portfolio-control-bar.component.html',
  styles: ''
})
export class PortfolioControlBarComponent {
  portfolioService = inject(PortfolioService);
  transactionModalService = inject(TransactionModalService);
  snackbar = inject(SnackBarService);
  confrimDialog = inject(ConfirmDialogService);

  isSelectMenuOpen = signal(false);
  isNameFormOpen = signal(false);
  isLoading = signal(false);

  nameFormActionType: 'create' | 'edit' = 'create';

  onPortfolioSelect(portfolioId: number | bigint): void {
    this.portfolioService.setCurrentPortfolioById(portfolioId);
    this.closeSelectMenu();
  }

  onAddAssetClick(): void {

  }

  async onNameFormSubmit(name: string): Promise<void> {
    if (!/[a-zA-Z]/.test(name)) {
      this.snackbar.show('invalid name', 'red');
      return;
    }

    this.isLoading.set(true);

    if (this.nameFormActionType === 'create')
      await this.createPortfolio(name);
    else
      await this.renamePortfolio(name);

    this.isLoading.set(false);
    this.closeNameForm();
  }

  async createPortfolio(name: string): Promise<void> {
    // const portfolio = await this.portfolioService.createPortfolio(name);

    // if (portfolio)
    //   this.snackbar.show('New Portfolio Created', 'green');
  }

  async renamePortfolio(name: string): Promise<void> {
    const { id, name: currentName } = this.portfolioService.currentPortfolio$()!;

    if (name === currentName) return;

    // const portfolio = await this.portfolioService.updatePortfolio(id, { name });

    // if (portfolio)
    //   this.snackbar.show('Portfolio Renamed', 'green');
  }

  async onDeleteClick(): Promise<void> {
    const portfolio = this.portfolioService.currentPortfolio$();
    if (!portfolio || portfolio.is_main)
      return;

    const confrim = await this.confrimDialog.open({
      title: 'Delete Portfolio',
      message: `Permanently delete the ${portfolio.name} Portfolio?`,
      actionButton: 'Delete'
    });

    if (confrim)
      this.deletePortfolio(portfolio.id);
  }

  async deletePortfolio(portfolioId: number | bigint): Promise<void> {
    // const result = await this.portfolioService.deletePortfolio(portfolioId);

    // if (result)
    //   this.snackbar.show('Portfolio Deleted', 'green');
  }

  openSelectMenu(): void {
    this.isSelectMenuOpen.set(true);
  }

  closeSelectMenu(): void {
    this.isSelectMenuOpen.set(false);
  }

  openNameForm(action: 'create' | 'edit'): void {
    this.nameFormActionType = action;
    this.isNameFormOpen.set(true);
    this.isSelectMenuOpen.set(false);
  }

  closeNameForm(): void {
    this.isNameFormOpen.set(false);
  }
}
