import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ms-label-button',
  imports: [],
  template: `
    <button (click)="changeSortKey.emit()" [class]="className()">
      {{content()}}
    </button>
  `,
  styleUrls: [
    './labels-bar.component.scss',
    '../coins-list.component.scss'
  ]

})
export class LabelButtonComponent {
  content = input.required<string>();
  className = input<string>('');
  changeSortKey = output<void>();
}
