import { Component, effect, inject, signal } from '@angular/core';
import { ExchangeBarComponent } from './exchange-bar/exchange-bar.component';
import { CoingeckoService } from '../../shared/services/coingecko.service';
import exchangesMock from '../../shared/mock/exchanges.json';
import { ExchangesLabelsBarComponent } from './exchanges-labels-bar/exchanges-labels-bar.component';

@Component({
  selector: 'ms-exchanges',
  imports: [ExchangesLabelsBarComponent, ExchangeBarComponent],
  templateUrl: './exchanges.component.html',
  styleUrl: './exchanges.component.scss'
})
export class ExchangesComponent {
  coinService = inject(CoingeckoService);

  exchanges = signal<Exchange[]>([]);
  isLoading = signal<boolean>(true);

  sortKey = signal<ExchangeSortKey>('');
  isAscOrder = signal<boolean>(true);

  constructor() {
    this.getExchangesList();
    effect(() => this.sortExchanges());
  }

  async getExchangesList(): Promise<void> {
    // this.isLoading.set(true);

    // const exchanges = await this.coinService.getExchanges();

    // this.exchanges.set(exchanges);
    // this.isLoading.set(false);

    this.exchanges.set(exchangesMock as Exchange[]);
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
}
