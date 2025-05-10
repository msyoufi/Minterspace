import { Component, inject, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { AccountService } from '../../../../shared/services/account.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { PasswordEyeComponent } from '../../../../shared/components/password-eye.component';

@Component({
  selector: 'ms-delete-account-form',
  imports: [MatExpansionModule, FormsModule, MatProgressSpinner, PasswordEyeComponent],
  templateUrl: './delete-account-form.component.html',
  styleUrl: '../../account.component.scss'
})
export class DeleteAccountFormComponent {
  accountService = inject(AccountService);
  authService = inject(AuthService);
  confirmDialog = inject(ConfirmDialogService);
  snackbar = inject(SnackBarService);

  panel = viewChild<MatExpansionPanel>('panel');
  form = viewChild.required<NgForm>('form');
  isLoading = signal(false);

  async onSubmit(): Promise<void> {
    if (this.form().invalid) return;

    const confirm = await this.confirmDialog.open({
      title: 'Account Deletion',
      message: 'Are you sure you want to delete your account and all related data permanently?',
      actionButton: 'Delete Account',
    });

    if (confirm)
      this.delteAccount();
  }

  async delteAccount(): Promise<void> {
    this.isLoading.set(true);

    const { password } = this.form().value;
    const result = await this.accountService.deleteAccount(password);

    this.isLoading.set(false);

    if (!result) return;
    this.authService.logout();
    this.snackbar.show('Account Deleted', 'green', 4000);
  }

  onCancelClick(): void {
    this.panel()?.close()
  }
}
