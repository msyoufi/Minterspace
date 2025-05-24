import { Component, inject, output, signal } from '@angular/core';
import { WatchlistService } from '../../../shared/services/watchlist.service';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { EscapePressDirective } from '../../../shared/directives/escape-press.directive';
import { NameInputPaneComponent } from '../../../shared/components/name-input-pane/name-input-pane.component';
import { MatTooltip } from '@angular/material/tooltip';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';

@Component({
  selector: 'ms-watchlist-control-bar',
  imports: [ClickOutsideDirective, EscapePressDirective, NameInputPaneComponent, MatTooltip],
  templateUrl: './watchlist-control-bar.component.html',
  styles: ''
})
export class WatchlistControlBarComponent {
  watchlistService = inject(WatchlistService);
  snackbar = inject(SnackBarService);
  confrimDialog = inject(ConfirmDialogService);

  isSelectMenuOpen = signal(false);
  isNameFormOpen = signal(false);
  isLoading = signal(false);

  addCoinsClick = output<void>();

  formActionType: 'create' | 'edit' = 'create';

  onWatchlistSelect(watchlist: Watchlist): void {
    this.watchlistService.currentWatchlist$.set(watchlist);
    this.closeSelectMenu();
  }

  onAddCoinsClick(): void {
    this.addCoinsClick.emit();
  }

  async onNameFormSubmit(name: string): Promise<void> {
    if (!/[a-zA-Z]/.test(name)) {
      this.snackbar.show('Invalid Name');
      return;
    }

    this.isLoading.set(true);

    if (this.formActionType === 'create')
      await this.createWatchlist(name);
    else
      await this.renameWatchlist(name);

    this.isLoading.set(false);
    this.closeNameForm();
  }

  async createWatchlist(name: string): Promise<void> {
    const watchlist = await this.watchlistService.createWatchlist(name);

    if (watchlist)
      this.snackbar.show('New Watchlist Created', 'green');
  }

  async renameWatchlist(name: string): Promise<void> {
    const { id, name: currentName } = this.watchlistService.currentWatchlist$()!;

    if (name === currentName) return;

    const watchlist = await this.watchlistService.updateWatchlist(id, { name });

    if (watchlist)
      this.snackbar.show('Watchlist Renamed', 'green');
  }

  async onDeleteClick(): Promise<void> {
    const watchlist = this.watchlistService.currentWatchlist$();
    if (!watchlist || watchlist.is_main)
      return;

    const confrim = await this.confrimDialog.open({
      title: 'Delete Watchlist',
      message: `Permanently delete the ${watchlist.name} watchlist?`,
      actionButton: 'Delete'
    });

    if (confrim)
      this.deleteWatchlist(watchlist.id);
  }

  async deleteWatchlist(watchlistId: number | bigint): Promise<void> {
    const result = await this.watchlistService.deleteWatchlist(watchlistId);

    if (result)
      this.snackbar.show('Watchlist Deleted', 'green');
  }

  openSelectMenu(): void {
    this.isSelectMenuOpen.set(true);
  }

  closeSelectMenu(): void {
    this.isSelectMenuOpen.set(false);
  }

  openNameForm(action: 'create' | 'edit'): void {
    this.formActionType = action;
    this.isNameFormOpen.set(true);
    this.isSelectMenuOpen.set(false);
  }

  closeNameForm(): void {
    this.isNameFormOpen.set(false);
  }
}
