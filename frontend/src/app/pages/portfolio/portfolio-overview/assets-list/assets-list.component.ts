import { Component, effect, inject, output, signal } from '@angular/core';
import { PortfolioService } from '../../../../shared/services/portfolio.service';
import { AssetBarComponent } from './asset-bar/asset-bar.component';
import { AssetsLabelsBarComponent } from './assets-labels-bar/assets-labels-bar.component';

@Component({
  selector: 'ms-assets-list',
  imports: [AssetBarComponent, AssetsLabelsBarComponent],
  templateUrl: './assets-list.component.html',
  styleUrl: './assets-list.component.scss'
})
export class AssetsListComponent {
  portfolioService = inject(PortfolioService);

  assets = signal<Asset[]>([]);

  // isLoading = input.required<boolean>();
  // loaderBarCount = input.required<number | string>();
  // loaderArr = computed(() => Array.from({ length: Number(this.loaderBarCount()) }));

  sortKey = signal<AssetSortKey>('');
  isAscOrder = signal<boolean>(true);

  addAssetClick = output<void>();

  constructor() {
    effect(() => this.populateAssets());
    effect(() => this.sortAssets());
  }

  populateAssets(): void {
    const assets = this.portfolioService.currentPortfolioData$()?.assets;
    if (!assets) return;

    this.assets.set(assets);
  }

  sortAssets(): void {
    const sortKey = this.sortKey();
    if (!sortKey) return;

    if (sortKey === 'name') {
      this.isAscOrder()
        ? this.assets().sort((a, b) => a[sortKey].localeCompare(b[sortKey]))
        : this.assets().sort((a, b) => b[sortKey].localeCompare(a[sortKey]));

    } else {
      this.isAscOrder()
        ? this.assets().sort((a, b) => a[sortKey] - b[sortKey])
        : this.assets().sort((a, b) => b[sortKey] - a[sortKey]);
    }
  }

  onSortLabelClick(sortKey: AssetSortKey): void {
    const isNewAscOrder = sortKey === this.sortKey() && this.isAscOrder()
      ? false
      : true;

    this.sortKey.set(sortKey);
    this.isAscOrder.set(isNewAscOrder)
  }

  onAddAssetClick(): void {
    this.addAssetClick.emit();
  }
}
