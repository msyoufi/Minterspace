import { Component, input, output } from '@angular/core';
import { LabelButtonComponent } from "./label-button.component";

@Component({
  selector: 'ms-labels-bar',
  imports: [LabelButtonComponent],
  templateUrl: './labels-bar.component.html',
  styleUrls: [
    './labels-bar.component.scss',
    '../coins-list.component.scss'
  ]
})
export class LabelsBarComponent {
  currentSortKey = input.required<SortKey | null>();
  isAscOrder = input.required<boolean>();

  changeSortKey = output<SortKey>();

  onSortKeyChange(sortKey: SortKey): void {
    this.changeSortKey.emit(sortKey);
  }

  labels: { content: string, sortKey: SortKey }[] = [
    {
      content: '#',
      sortKey: 'market_cap_rank'
    }, {
      content: 'Coin',
      sortKey: 'name'
    }, {
      content: 'Price',
      sortKey: 'current_price'
    }, {
      content: '24h%',
      sortKey: 'price_change_percentage_24h'
    }, {
      content: 'Market Cap',
      sortKey: 'market_cap'
    }, {
      content: '24h Volume',
      sortKey: 'total_volume'
    }, {
      content: 'Circulating Supply',
      sortKey: 'circulating_supply'
    },
  ];
}
