import { Component, input, output } from '@angular/core';
import { LabelButtonComponent } from '../../../shared/components/label-button.component';

@Component({
  selector: 'ms-exchanges-labels-bar',
  imports: [LabelButtonComponent],
  templateUrl: './exchanges-labels-bar.component.html',
  styleUrl: '../exchanges.component.scss'
})
export class ExchangesLabelsBarComponent {
  currentSortKey = input.required<ExchangeSortKey>();
  isAscOrder = input.required<boolean>();

  sortLabelClick = output<ExchangeSortKey>();

  onSortLabelClick(sortKey: ExchangeSortKey): void {
    this.sortLabelClick.emit(sortKey);
  }

  labels: { content: string, sortKey: ExchangeSortKey }[] = [
    {
      content: 'Rank',
      sortKey: 'trust_score_rank'
    }, {
      content: 'Name',
      sortKey: 'name'
    }, {
      content: 'Trust Score',
      sortKey: 'trust_score'
    }, {
      content: '24h Volume',
      sortKey: 'trade_volume_24h_btc_normalized'
    }, {
      content: 'Country',
      sortKey: ''
    }, {
      content: 'Established',
      sortKey: ''
    }
  ];
}
