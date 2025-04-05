import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbsolutPipe } from '../../../shared/pipes/absolut.pipe';

@Component({
  selector: 'ms-market-cap-panel',
  imports: [CommonModule, AbsolutPipe],
  template: `
    <p class="title">Total Market Cap</p>
    <p class="value">
      <span>$</span>{{marketCap() | number : '1.0-0'}}
    </p>
    <p class="percent">
      <span [class]="indicatorClass()">
        {{marketCapchange() | absolut | number:'1.1-1'}}%
      </span>
      <span class="title">24h</span>
    </p>
  `,
  styleUrl: './category-panels.component.scss'
})
export class MarketCapPanelComponent {
  marketCap = input.required<number>();
  marketCapchange = input.required<number>();
  indicatorClass = input.required<string>();
}
