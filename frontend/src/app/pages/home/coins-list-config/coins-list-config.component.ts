import { Component, EventEmitter, inject, input, Input, Output, signal } from '@angular/core';
import { CoingeckoService } from '../../../shared/services/coingecko.service';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { EscapePressDirective } from '../../../shared/directives/escape-press.directive';

@Component({
  selector: 'ms-coins-list-config',
  imports: [FormsModule, ClickOutsideDirective, EscapePressDirective],
  templateUrl: './coins-list-config.component.html',
  styleUrl: './coins-list-config.component.scss'
})
export class CoinsListConfigComponent {
  coinService = inject(CoingeckoService);

  isLoading = input.required<boolean>();
  isPaneOpen = signal(false);

  @Input({ required: true }) categoryId: string = '';
  @Output() categoryIdChange = new EventEmitter<string>();

  @Input({ required: true }) perPage: string = '25';
  @Output() perPageChange = new EventEmitter<string>();

  togglePane(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isPaneOpen.set(!this.isPaneOpen());
  }

  closePane(): void {
    this.isPaneOpen.set(false);
  }
}
