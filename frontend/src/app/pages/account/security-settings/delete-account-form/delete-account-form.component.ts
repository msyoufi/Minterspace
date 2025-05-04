import { Component, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { AccountService } from '../../../../shared/services/account.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'ms-delete-account-form',
  imports: [MatExpansionModule, FormsModule, MatProgressSpinner],
  templateUrl: './delete-account-form.component.html',
  styleUrl: '../../account.component.scss'
})
export class DeleteAccountFormComponent {
  accountService = inject(AccountService);
  authService = inject(AuthService);
  snackbar = inject(SnackBarService);

  panel = viewChild<MatExpansionPanel>('panel');
  form = viewChild.required<NgForm>('form');
  isLoading = signal(false);

  async onSubmit(): Promise<void> {
    if (this.form().invalid) return;

    this.isLoading.set(true);

    const { password } = this.form().value;
    const result = await this.accountService.deleteAccount(password);

    this.isLoading.set(false);
    console.log(result);

    if (!result) return;
    this.authService.logout();
    this.snackbar.show('Account Deleted', 'green', 4000);
  }

  onCancelClick(): void {
    this.panel()?.close()
  }
}
