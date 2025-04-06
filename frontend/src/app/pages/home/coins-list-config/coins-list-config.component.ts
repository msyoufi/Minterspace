import { Component, EventEmitter, inject, input, Input, Output } from '@angular/core';
import { CoingeckoService } from '../../../shared/services/coingecko.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ms-coins-list-config',
  imports: [FormsModule],
  templateUrl: './coins-list-config.component.html',
  styleUrl: './coins-list-config.component.scss'
})
export class CoinsListConfigComponent {
  coinService = inject(CoingeckoService);

  isLoading = input.required<boolean>();

  @Input({ required: true }) categoryId: string = '';
  @Output() categoryIdChange = new EventEmitter<string>();

  @Input({ required: true }) perPage: string = '25';
  @Output() perPageChange = new EventEmitter<string>();
}
