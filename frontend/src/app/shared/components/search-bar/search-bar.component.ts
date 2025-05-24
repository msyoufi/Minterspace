import { Component, DestroyRef, effect, ElementRef, inject, output, viewChild } from '@angular/core';
import { CoingeckoService } from '../../services/coingecko.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, filter, of, Subject, switchMap, tap } from 'rxjs';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'ms-search-bar',
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  coinService = inject(CoingeckoService);
  snackbar = inject(SnackBarService);
  destroyRef = inject(DestroyRef);

  searchQuery$ = new Subject<string>();

  inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
  searchResults = output<SearchResults | null>();
  isSearching = output<boolean>();

  constructor() {
    this.subscribeToSearch();
    effect(() => this.inputRef().nativeElement.focus());
  }

  subscribeToSearch(): void {
    this.searchQuery$
      .pipe(
        tap(() => this.isSearching.emit(true)),
        debounceTime(300),
        filter(query => this.validateQuery(query)),
        switchMap(query => this.coinService.searchCoinGecko(query)),
        catchError(err => {
          this.snackbar.show('Something went wrong!');
          this.isSearching.emit(false);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(searchResults => {
        this.searchResults.emit(searchResults);
        this.isSearching.emit(false);
      });
  }

  validateQuery(query: string): boolean {
    if (!query) {
      this.isSearching.emit(false);
      return false;
    }

    const isValid = /^[a-zA-Z0-9]+$/.test(query);

    if (!isValid) {
      this.isSearching.emit(false);
      this.snackbar.show('Query not valid!');
    }

    return isValid;
  }
}
