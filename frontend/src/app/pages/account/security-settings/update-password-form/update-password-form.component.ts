import { Component, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { AccountService } from '../../../../shared/services/account.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';

@Component({
  selector: 'ms-update-password-form',
  imports: [MatExpansionModule, FormsModule, MatProgressSpinner],
  templateUrl: './update-password-form.component.html',
  styleUrl: '../../account.component.scss'
})
export class UpdatePasswordFormComponent {
  accountService = inject(AccountService);
  snackbar = inject(SnackBarService);

  panel = viewChild<MatExpansionPanel>('panel');
  form = viewChild.required<NgForm>('form');
  isLoading = signal(false);

  async onSubmit(): Promise<void> {
    if (this.form().invalid) return;

    this.isLoading.set(true);

    const { newPassword, currentPassword } = this.form().value;
    const result = await this.accountService.updatePassword(newPassword, currentPassword);

    this.isLoading.set(false);
    console.log(result);

    if (result)
      this.snackbar.show('Password Changed', 'green');
  }

  onCancelClick(): void {
    this.panel()?.close()
  }
}
