import { Component, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { AccountService } from '../../../../shared/services/account.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';

@Component({
  selector: 'ms-username-form',
  imports: [MatExpansionModule, FormsModule, MatProgressSpinner],
  templateUrl: './username-form.component.html',
  styleUrl: '../../account.component.scss'
})
export class UsernameFormComponent {
  accountService = inject(AccountService);
  snackbar = inject(SnackBarService);

  username = input.required<string>();
  panel = viewChild<MatExpansionPanel>('panel');
  form = viewChild.required<NgForm>('form');
  isLoading = signal(false);

  async onSubmit(): Promise<void> {
    if (this.form().invalid) return;

    this.isLoading.set(true);

    const { username } = this.form().value;
    const result = await this.accountService.updateUsername(username);

    this.isLoading.set(false);

    if (result)
      this.snackbar.show('Username Changed', 'green');
  }

  onCancelClick(): void {
    this.panel()?.close()
  }
}
