import { Component, input } from '@angular/core';

@Component({
  selector: 'ms-password-eye',
  imports: [],
  template: `
    <button type="button" class="icon-button" (click)="onClick()">
      <i [class]="'bi bi-eye' + (input().type === 'password' ? '-slash' : '')"></i>
    </button>
  `,
  styles: `
    .bi {
      font-size: 1.3rem;
      color: var(--gray);
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
    }
  `
})
export class PasswordEyeComponent {
  input = input.required<HTMLInputElement>();

  onClick(): void {
    const newType = this.input().type === 'password' ? 'text' : 'password';
    this.input().setAttribute('type', newType);
  }
}
