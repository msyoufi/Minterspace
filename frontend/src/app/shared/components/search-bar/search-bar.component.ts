import { AfterViewInit, Component, DestroyRef, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { CoingeckoService } from '../../services/coingecko.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, filter, of, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'ms-search-bar',
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements AfterViewInit {
  coinService = inject(CoingeckoService);
  destroyRef = inject(DestroyRef);

  searchQuery$ = new Subject<string>();

  inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
  searchResults = output<SearchResults | null>();
  isLoading = signal(true);

  constructor() {
    this.subscribeToSearch()
  }

  ngAfterViewInit(): void {
    this.inputRef().nativeElement.focus();
  }

  subscribeToSearch(): void {
    this.searchQuery$
      .pipe(
        debounceTime(300),
        filter(query => !!query && this.validateQuery(query)),
        distinctUntilChanged(),
        switchMap(query => this.coinService.searchCoinGecko(query)),
        catchError(error => {
          this.showMessage(error);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(searchResults => {
        this.searchResults.emit(searchResults);
      });
  }

  validateQuery(query: string): boolean {
    const isValid = /^[a-zA-Z0-9]+$/.test(query);

    if (!isValid)
      this.showMessage('query not valid');

    return isValid;
  }

  showMessage(msg: any): void {
    console.log(msg);
  }
}
