import { Component, inject } from '@angular/core';
import { CoinsListComponent } from "../../shared/components/coins-list/coins-list.component";
import { CoingeckoService } from '../../shared/services/coingecko.service';

@Component({
  selector: 'ms-home',
  imports: [CoinsListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  coinService = inject(CoingeckoService);

  constructor() {
    this.coinService.getCoins();
  }
}
