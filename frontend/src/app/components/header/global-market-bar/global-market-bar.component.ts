import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoingeckoService } from '../../../shared/services/coingecko.service';

@Component({
  selector: 'ms-global-market-bar',
  imports: [CommonModule],
  templateUrl: './global-market-bar.component.html',
  styleUrl: './global-market-bar.component.scss'
})
export class GlobalMarketBarComponent {
  coinService = inject(CoingeckoService);
  
}
