import { Component, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { AccountService } from '../../../../shared/services/account.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import MsValidators from '../../../../shared/utils/ms.validators';
import { PasswordEyeComponent } from '../../../../shared/components/password-eye.component';

@Component({
  selector: 'ms-update-password-form',
  imports: [MatExpansionModule, ReactiveFormsModule, MatProgressSpinner, PasswordEyeComponent],
  templateUrl: './update-password-form.component.html',
  styleUrl: '../../account.component.scss'
})
export class UpdatePasswordFormComponent {
  accountService = inject(AccountService);
  snackbar = inject(SnackBarService);

  form = new FormGroup({
    newPassword: new FormControl('', [Validators.required, MsValidators.password, Validators.minLength(8)]),
    currentPassword: new FormControl('', Validators.required)
  });

  panel = viewChild<MatExpansionPanel>('panel');
  isLoading = signal(false);

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.isLoading.set(true);

    const { newPassword, currentPassword } = this.form.value;
    const result = await this.accountService.updatePassword(newPassword!, currentPassword!);

    this.isLoading.set(false);

    if (!result) return;

    this.snackbar.show('Username Changed', 'green');
    this.closePanel();
  }

  closePanel(): void {
    this.panel()?.close()
  }
}
