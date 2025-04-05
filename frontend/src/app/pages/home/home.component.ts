import { Component, inject, signal } from '@angular/core';
import { CoinsListComponent } from "../../shared/components/coins-list/coins-list.component";
import { CoingeckoService } from '../../shared/services/coingecko.service';
import { CategoryPanelsComponent } from "./category-panels/category-panels.component";
import { CoinsListConfigComponent } from "./coins-list-config/coins-list-config.component";

@Component({
  selector: 'ms-home',
  imports: [CoinsListComponent, CategoryPanelsComponent, CoinsListConfigComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  coinService = inject(CoingeckoService);
  currentCategory = signal<CoinCategory | GlobalMarket | null>(this.coinService.coinCategories()[0]);

  constructor() {
    this.coinService.getCoins();
  }
}
