import { Component, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../../shared/services/auth.service';
import { DatePipe } from '@angular/common';
import { UpdateEmailFormComponent } from './update-email-form/update-email-form.component';
import { UpdatePasswordFormComponent } from './update-password-form/update-password-form.component';
import { DeleteAccountFormComponent } from './delete-account-form/delete-account-form.component';

@Component({
  selector: 'ms-security-settings',
  imports: [MatExpansionModule, DatePipe, UpdateEmailFormComponent, UpdatePasswordFormComponent, DeleteAccountFormComponent],
  templateUrl: './security-settings.component.html',
  styleUrl: '../account.component.scss'
})
export class SecuritySettingsComponent {
  authService = inject(AuthService);
}
