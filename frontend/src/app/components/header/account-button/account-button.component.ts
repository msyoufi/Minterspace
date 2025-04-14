import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'ms-account-button',
  imports: [RouterLink],
  templateUrl: './account-button.component.html',
  styleUrl: './account-button.component.scss'
})
export class AccountButtonComponent {
  authService = inject(AuthService);
  user = input.required<User | null>();
}
