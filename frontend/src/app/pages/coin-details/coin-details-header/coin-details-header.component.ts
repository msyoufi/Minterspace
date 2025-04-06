import { Component, input } from '@angular/core';

@Component({
  selector: 'ms-coin-details-header',
  imports: [],
  templateUrl: './coin-details-header.component.html',
  styleUrl: './coin-details-header.component.scss'
})
export class CoinDetailsHeaderComponent {
  coin = input.required<CoinDetails>();
}
