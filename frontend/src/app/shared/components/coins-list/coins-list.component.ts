import { Component, computed, input, signal } from '@angular/core';
import { CoinBarComponent } from "./coin-bar/coin-bar.component";
import { LabelsBarComponent } from './labels-bar/labels-bar.component';

@Component({
  selector: 'ms-coins-list',
  imports: [CoinBarComponent, LabelsBarComponent],
  templateUrl: './coins-list.component.html',
  styleUrl: './coins-list.component.scss'
})
export class CoinsListComponent {
  coins = input.required<CoinBasic[]>();
  sortedCoins = computed(() => this.sortCoins())

  sortKey = signal<SortKey | null>(null);
  isAscOrder = signal<boolean>(true);

  sortCoins(): CoinBasic[] {
    const sortKey = this.sortKey();

    if (!sortKey)
      return this.coins();

    let sortedCoins: CoinBasic[] = [];

    if (sortKey === 'name') {
      sortedCoins = this.isAscOrder()
        ? this.coins().sort((a, b) => a[sortKey].localeCompare(b[sortKey]))
        : this.coins().sort((a, b) => b[sortKey].localeCompare(a[sortKey]));

    } else {
      sortedCoins = this.isAscOrder()
        ? this.coins().sort((a, b) => a[sortKey] - b[sortKey])
        : this.coins().sort((a, b) => b[sortKey] - a[sortKey]);
    }

    return sortedCoins;
  }

  onSortKeyChange(newSortKey: SortKey): void {
    const isNewAscOrder = newSortKey === this.sortKey() && this.isAscOrder()
      ? false
      : true;

    this.sortKey.set(newSortKey);
    this.isAscOrder.set(isNewAscOrder)
  }
}
