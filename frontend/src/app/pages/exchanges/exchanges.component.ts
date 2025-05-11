import { Component, computed, effect, inject, signal } from '@angular/core';
import { ExchangeBarComponent } from './exchange-bar/exchange-bar.component';
import { CoingeckoService } from '../../shared/services/coingecko.service';
import { ExchangesLabelsBarComponent } from './exchanges-labels-bar/exchanges-labels-bar.component';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { FormsModule } from '@angular/forms';
import { ExchangeBarLoaderComponent } from './exchange-bar-loader/exchange-bar-loader.component';

@Component({
  selector: 'ms-exchanges',
  imports: [ExchangesLabelsBarComponent, ExchangeBarComponent, PaginatorComponent, ExchangeBarLoaderComponent, FormsModule],
  templateUrl: './exchanges.component.html',
  styleUrl: './exchanges.component.scss'
})
export class ExchangesComponent {
  coinService = inject(CoingeckoService);

  exchanges = signal<Exchange[]>([]);
  isLoading = signal<boolean>(true);

  sortKey = signal<ExchangeSortKey>('');
  isAscOrder = signal<boolean>(true);

  perPage = JSON.parse(localStorage.getItem('perPage') ?? '25');
  page = 1;
  isEndOfList = false;

  constructor() {
    this.getExchangesList();
    effect(() => this.sortExchanges());
  }

  async getExchangesList(): Promise<void> {
    scroll({ top: 0 });

    const params: any = {
      page: this.page,
      per_page: this.perPage,
    };

    this.isLoading.set(true);

    const exchanges = await this.coinService.getExchanges(params);

    this.exchanges.set(exchanges);
    this.isEndOfList = exchanges.length < parseInt(this.perPage);
    this.isLoading.set(false);
  }

  sortExchanges(): void {
    const sortKey = this.sortKey();
    if (!sortKey) return;

    if (sortKey === 'name') {
      this.isAscOrder()
        ? this.exchanges().sort((a, b) => a[sortKey].localeCompare(b[sortKey]))
        : this.exchanges().sort((a, b) => b[sortKey].localeCompare(a[sortKey]));

    } else {
      this.isAscOrder()
        ? this.exchanges().sort((a, b) => a[sortKey] - b[sortKey])
        : this.exchanges().sort((a, b) => b[sortKey] - a[sortKey]);
    }
  }

  onSortLabelClick(sortKey: ExchangeSortKey): void {
    const isNewAscOrder = sortKey === this.sortKey() && this.isAscOrder()
      ? false
      : true;

    this.sortKey.set(sortKey);
    this.isAscOrder.set(isNewAscOrder)
  }

  onPerPageChange(): void {
    this.page = 1;
    this.isAscOrder.set(true);
    this.sortKey.set('trust_score_rank');

    localStorage.setItem('perPage', JSON.stringify(this.perPage));

    this.getExchangesList();
  }

  onPageChange(): void {
    this.getExchangesList();
  }

  getLoadingArray(): void[] {
    return Array.from({ length: Number(this.perPage) });
  }
}