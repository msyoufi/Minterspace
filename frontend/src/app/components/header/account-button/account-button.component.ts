import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ms-account-button',
  imports: [RouterLink],
  templateUrl: './account-button.component.html',
  styleUrl: './account-button.component.scss'
})
export class AccountButtonComponent {
  user = input.required<User | null>();
}
