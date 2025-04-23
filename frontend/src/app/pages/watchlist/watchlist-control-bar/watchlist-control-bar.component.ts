import { Component, inject, output, signal } from '@angular/core';
import { WatchlistService } from '../../../shared/services/watchlist.service';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { EscapePressDirective } from '../../../shared/directives/escape-press.directive';
import { NameInputPaneComponent } from '../../../shared/components/name-input-pane/name-input-pane.component';
import { MatTooltip } from '@angular/material/tooltip';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Component({
  selector: 'ms-watchlist-control-bar',
  imports: [ClickOutsideDirective, EscapePressDirective, NameInputPaneComponent, MatTooltip],
  templateUrl: './watchlist-control-bar.component.html',
  styleUrl: './watchlist-control-bar.component.scss'
})
export class WatchlistControlBarComponent {
  watchlistService = inject(WatchlistService);
  snackbar = inject(SnackBarService);

  isSelectMenuOpen = signal(false);
  isNameFormOpen = signal(false);
  isLoading = signal(false);
  formActionType: 'create' | 'edit' = 'create';
  addCoinsClick = output<void>();

  onWatchlistSelect(watchlist: Watchlist): void {
    this.watchlistService.currentWatchlist$.set(watchlist);
    this.closeSelectMenu();
  }

  onAddCoinsClick(): void {
    this.addCoinsClick.emit();
  }

  async onNameFormSubmit(name: string): Promise<void> {
    if (!/[a-zA-Z]/.test(name))
      return console.log('invalid name');

    this.isLoading.set(true);

    if (this.formActionType === 'create')
      this.createWatchlist(name);
    else
      this.renameWatchlist(name);

    this.isLoading.set(false);
    this.closeNameForm();
  }

  async createWatchlist(name: string): Promise<void> {
    const watchlist = await this.watchlistService.createWatchlist(name);

    if (watchlist)
      this.snackbar.show('New Watchlist Created', 'green');
  }

  async renameWatchlist(name: string): Promise<void> {
    const id = this.watchlistService.currentWatchlist$()!.id;
    const watchlist = await this.watchlistService.updateWatchlist(id, { name });

    if (watchlist)
      this.snackbar.show('Watchlist Renamed', 'green');
  }

  async onDeleteClick(): Promise<void> {
    const watchlist = this.watchlistService.currentWatchlist$();
    if (!watchlist || watchlist.is_main)
      return;

    const result = await this.watchlistService.deleteWatchlist(watchlist.id);

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
