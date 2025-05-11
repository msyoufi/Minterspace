import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ms-label-button',
  imports: [],
  template: `
    <button (click)="labelClick.emit()" [class]="className()" [class.disabled]="!sortKey()">
      {{content()}}
    </button>
  `,
  styles: `
    button {
      position: relative;

      &:hover {
        text-decoration: underline;
      }

      &.disabled {
        pointer-events: none;
      }
    }`
})
export class LabelButtonComponent {
  content = input.required<string>();
  sortKey = input.required<CoinSortKey | AssetSortKey | TransactionSortKey | ExchangeSortKey>();
  className = input<'asc' | 'desc' | ''>('');
  labelClick = output<void>();
}
