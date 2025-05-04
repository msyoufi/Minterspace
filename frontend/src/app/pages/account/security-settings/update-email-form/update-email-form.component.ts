import { Component, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { AccountService } from '../../../../shared/services/account.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';

@Component({
  selector: 'ms-update-email-form',
  imports: [MatExpansionModule, FormsModule, MatProgressSpinner],
  templateUrl: './update-email-form.component.html',
  styleUrl: '../../account.component.scss'
})
export class UpdateEmailFormComponent {
  accountService = inject(AccountService);
  snackbar = inject(SnackBarService);

  email = input.required<string>();
  panel = viewChild<MatExpansionPanel>('panel');
  form = viewChild.required<NgForm>('form');
  isLoading = signal(false);

  async onSubmit(): Promise<void> {
    if (this.form().invalid) return;

    this.isLoading.set(true);

    const { email, password } = this.form().value;
    const result = await this.accountService.updateEmail(email, password);

    this.isLoading.set(false);
    console.log(result);

    if (result)
      this.snackbar.show('Email Changed', 'green');
  }

  onCancelClick(): void {
    this.panel()?.close()
  }
}
