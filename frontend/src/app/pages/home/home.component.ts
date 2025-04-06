import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CoinsListComponent } from "../../shared/components/coins-list/coins-list.component";
import { CoingeckoService } from '../../shared/services/coingecko.service';
import { CategoryPanelsComponent } from "./category-panels/category-panels.component";
import { CoinsListConfigComponent } from "./coins-list-config/coins-list-config.component";
import { PaginatorComponent } from "./paginator/paginator.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import mockCoins from '../../shared/mock/coins.json';

@Component({
  selector: 'ms-home',
  imports: [CoinsListComponent, CategoryPanelsComponent, CoinsListConfigComponent, PaginatorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  coinService = inject(CoingeckoService);
  destroyRef = inject(DestroyRef);

  coins = signal<CoinBasic[]>([]);
  currentCategory = signal<CoinCategory | GlobalMarket | null>(this.coinService.coinCategories()[0]);
  perPage = signal<number>(25);
  page = signal<number>(1);
  isEndOfCoins = signal<boolean>(false);

  constructor() {
    this.getCoinsList();
  }

  getCoinsList(): void {
    const params = this.getParams();

    this.coinService.getCoinsList(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(coins => this.coins.set(coins));

    // this.coins.set(mockCoins)
  }

  getParams(): { [key: string]: string | number | boolean } {
    const params: any = {
      page: this.page(),
      per_page: this.perPage(),
      sparkline: true
    };

    const currentCategory = this.currentCategory();

    if (currentCategory && 'id' in currentCategory)
      params.category = currentCategory.id;

    return params;
  }

  onPageChange(page: number): void {
    console.log(page);
  }
}
