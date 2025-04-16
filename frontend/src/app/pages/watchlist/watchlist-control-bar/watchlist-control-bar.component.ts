import { Component, effect, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { WatchlistService } from '../../../shared/services/watchlist.service';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { EscapePressDirective } from '../../../shared/directives/escape-press.directive';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

interface NameForm {
  name: string,
  actionType: 'create' | 'edit'
};

@Component({
  selector: 'ms-watchlist-control-bar',
  imports: [ClickOutsideDirective, EscapePressDirective, FormsModule, MatProgressSpinner],
  templateUrl: './watchlist-control-bar.component.html',
  styleUrl: './watchlist-control-bar.component.scss'
})
export class WatchlistControlBarComponent {
  watchlistService = inject(WatchlistService);

  isSelectMenuOpen = signal(false);
  isNameFormOpen = signal(false);
  isLoading = signal(false);
  nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');
  formActionType: 'create' | 'edit' = 'create';

  addCoinsClick = output<void>();

  constructor() {
    effect(() => this.nameInput()?.nativeElement.focus());
  }

  onWatchlistSelect(watchlistId: number | bigint): void {
    const watchlist = this.watchlistService.watchlists$().find(wl => wl.id === watchlistId)!;
    this.watchlistService.currentWatchlist$.set(watchlist);
    this.closeSelectMenu();
  }

  onAddCoinsClick(): void {
    this.addCoinsClick.emit();
  }

  async onNameFormSubmit(values: NameForm): Promise<void> {
    const { name, actionType } = values;

    if (!/[a-zA-Z]/.test(name))
      return console.log('invalid name');

    this.isLoading.set(true);

    if (actionType === 'create') {
      await this.watchlistService.createWatchlist(name, []);
      console.log('New watchlist added');

    } else {
      const id = this.watchlistService.currentWatchlist$()!.id;
      await this.watchlistService.updateWatchlist(id, { name });
      console.log('Watchlist renamed');
    }

    this.isLoading.set(false);
    this.closeNameForm();
  }

  onDeleteClick(): void {
    this.deleteCurrentWatchlist();
  }

  async deleteCurrentWatchlist(): Promise<void> {
    const id = this.watchlistService.currentWatchlist$()!.id;
    await this.watchlistService.deleteWatchlist(id);

    console.log('Watchlist deleted');
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
  }

  closeNameForm(): void {
    this.isNameFormOpen.set(false);
  }
}
