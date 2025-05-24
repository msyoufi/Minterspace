import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { EscapePressDirective } from '../../../shared/directives/escape-press.directive';

@Component({
  selector: 'ms-coin-market-data',
  imports: [CommonModule, ClickOutsideDirective, EscapePressDirective],
  templateUrl: './coin-market-data.component.html',
  styleUrl: './coin-market-data.component.scss'
})
export class CoinMarketDataComponent {
  coin = input.required<CoinDetails>();

  isExplorersListOpen = signal(false);

  toggleExplorersList(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isExplorersListOpen.set(!this.isExplorersListOpen());
  }

  closeExplorersList(): void {
    this.isExplorersListOpen.set(false);
  }
}
