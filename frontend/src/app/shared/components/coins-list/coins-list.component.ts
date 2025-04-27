import { Component, computed, effect, input, signal } from '@angular/core';
import { CoinBarComponent } from "./coin-bar/coin-bar.component";
import { LabelsBarComponent } from './labels-bar/labels-bar.component';
import { CoinBarLoaderComponent } from "./coin-bar/coin-bar-loader/coin-bar-loader.component";

@Component({
  selector: 'ms-coins-list',
  imports: [CoinBarComponent, LabelsBarComponent, CoinBarLoaderComponent],
  templateUrl: './coins-list.component.html',
  styleUrl: './coins-list.component.scss'
})
export class CoinsListComponent {
  coins = input.required<CoinBasic[]>();
  isLoading = input.required<boolean>();
  loaderBarCount = input.required<number | string>();
  loaderArr = computed(() => Array.from({ length: Number(this.loaderBarCount()) }));

  sortKey = signal<CoinSortKey>('');
  isAscOrder = signal<boolean>(true);

  constructor() {
    effect(() => this.sortCoins())
  }

  sortCoins(): void {
    const sortKey = this.sortKey();
    if (!sortKey) return;

    if (sortKey === 'name') {
      this.isAscOrder()
        ? this.coins().sort((a, b) => a[sortKey].localeCompare(b[sortKey]))
        : this.coins().sort((a, b) => b[sortKey].localeCompare(a[sortKey]));

    } else {
      this.isAscOrder()
        ? this.coins().sort((a, b) => a[sortKey] - b[sortKey])
        : this.coins().sort((a, b) => b[sortKey] - a[sortKey]);
    }
  }

  onSortLabelClick(sortKey: CoinSortKey): void {
    const isNewAscOrder = sortKey === this.sortKey() && this.isAscOrder()
      ? false
      : true;

    this.sortKey.set(sortKey);
    this.isAscOrder.set(isNewAscOrder)
  }
}
