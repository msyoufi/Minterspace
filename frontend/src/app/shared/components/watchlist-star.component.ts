import { Component, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'ms-watchlist-star',
  imports: [],
  template: `
    <button class="icon-button" (click)="onStarClick($event)">
      <i class='bi bi-star'></i>
    </button>
  `,
  styles: ''
})
export class WatchlistStarComponent {
  coinId = input.required<string>();

  onStarClick(e: MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();
    console.log(this.coinId());
    // TODO
  }
}
