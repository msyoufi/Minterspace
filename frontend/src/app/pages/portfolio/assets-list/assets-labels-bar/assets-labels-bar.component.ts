import { Component, input, output } from '@angular/core';
import { LabelButtonComponent } from '../../../../shared/components/label-button.component';

@Component({
  selector: 'ms-assets-labels-bar',
  imports: [LabelButtonComponent],
  templateUrl: './assets-labels-bar.component.html',
  styleUrl: '../assets-list.component.scss'
})
export class AssetsLabelsBarComponent {
  currentSortKey = input.required<AssetSortKey>();
  isAscOrder = input.required<boolean>();

  sortLabelClick = output<AssetSortKey>();

  onSortLabelClick(sortKey: AssetSortKey): void {
    this.sortLabelClick.emit(sortKey);
  }

  labels: { content: string, sortKey: AssetSortKey }[] = [
    {
      content: 'Asset',
      sortKey: 'name'
    }, {
      content: 'Price',
      sortKey: 'current_price'
    }, {
      content: '24h%',
      sortKey: 'price_change_percentage_24h'
    }, {
      content: 'Last 7 Days',
      sortKey: ''
    }, {
      content: 'Holdings',
      sortKey: 'current_value'
    }, {
      content: 'Avg. Buy Price',
      sortKey: 'avrg_buy_price'
    }, {
      content: 'Profit/Loss',
      sortKey: 'profit_loss'
    }, {
      content: 'Actions',
      sortKey: ''
    }
  ];
}
