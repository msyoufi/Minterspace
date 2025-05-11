import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'ms-exchange-bar',
  imports: [CommonModule],
  templateUrl: './exchange-bar.component.html',
  styleUrls: [
    './exchange-bar.component.scss',
    '../exchanges.component.scss'
  ]
})
export class ExchangeBarComponent {
  exchange = input.required<Exchange>();
}
