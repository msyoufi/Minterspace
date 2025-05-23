import { Component, effect, inject, signal } from '@angular/core';
import { CoinsListComponent } from "../../shared/components/coins-list/coins-list.component";
import { CoingeckoService } from '../../shared/services/coingecko.service';
import { CategoryPanelsComponent } from "./category-panels/category-panels.component";
import { CoinsListConfigComponent } from "./coins-list-config/coins-list-config.component";
import { PaginatorComponent } from "../../shared/components/paginator/paginator.component";

@Component({
  selector: 'ms-home',
  imports: [CoinsListComponent, CategoryPanelsComponent, CoinsListConfigComponent, PaginatorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  coinService = inject(CoingeckoService);

  coins = signal<CoinBasic[]>([]);
  currentCategory = signal<CoinCategory | GlobalMarket | null>(null);
  isLoading = signal<boolean>(true);

  perPage = JSON.parse(localStorage.getItem('perPage') ?? '25');
  page = 1;
  isEndOfCoins = false;
  categoryId = '';

  constructor() {
    effect(() => this.currentCategory.set(this.coinService.globalMarket()));
    this.getCoinsList();
  }

  async getCoinsList(): Promise<void> {
    scroll({ top: 0 });
    this.isLoading.set(true);

    const coins = await this.coinService.getCoinsList(this.getParams());

    this.coins.set(coins);
    this.isEndOfCoins = coins.length < parseInt(this.perPage);
    this.isLoading.set(false);
  }

  getParams(): { [key: string]: string | number | boolean } {
    const params: any = {
      page: this.page,
      per_page: this.perPage,
      sparkline: true
    };

    if (this.categoryId)
      params.category = this.categoryId;

    return params;
  }

  onCategoryIdChange(): void {
    this.page = 1;
    this.getCoinsList();

    const category =
      this.coinService.coinCategories().find(c => c.id === this.categoryId) ||
      this.coinService.globalMarket();

    this.currentCategory.set(category);
  }

  onPerPageChange(): void {
    localStorage.setItem('perPage', JSON.stringify(this.perPage));
    this.getCoinsList();
  }

  onPageChange(): void {
    this.getCoinsList();
  }
}
