import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ms-paginator',
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  page = input.required<number>();
  isEndOfCoins = input.required<boolean>();

  pageChange = output<number>();

  onClick(page: number) {
    this.pageChange.emit(page);
  }
}
