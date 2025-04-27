import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ms-label-button',
  imports: [],
  template: `
    <button (click)="changeSortKey.emit()" [class]="className()">
      {{content()}}
    </button>
  `,
  styles: `
    button {
      position: relative;

      &:hover {
        text-decoration: underline;
      }
    }`
})
export class LabelButtonComponent {
  content = input.required<string>();
  className = input<'asc' | 'desc' | ''>('');
  changeSortKey = output<void>();
}
