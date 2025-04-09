import { Component, inject } from '@angular/core';
import { AuthModalService } from '../../auth-modal/auth-modal.service';

@Component({
  selector: 'ms-account-button',
  imports: [],
  templateUrl: './account-button.component.html',
  styleUrl: './account-button.component.scss'
})
export class AccountButtonComponent {
  authModel = inject(AuthModalService);

  openAuthModal(): void {
    this.authModel.open('');
  }
}
