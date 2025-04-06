import { Component, EventEmitter, Input, input, Output } from '@angular/core';

@Component({
  selector: 'ms-paginator',
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  isEndOfCoins = input.required<boolean>();

  @Input({ required: true }) page: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  onClick(change: number) {
    this.page += change;
    this.pageChange.emit(this.page);
  }
}
