import { Component, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { AccountService } from '../../../../shared/services/account.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'ms-update-password-form',
  imports: [MatExpansionModule, FormsModule, MatProgressSpinner],
  templateUrl: './update-password-form.component.html',
  styleUrl: '../../account.component.scss'
})
export class UpdatePasswordFormComponent {
  accountService = inject(AccountService);

  panel = viewChild<MatExpansionPanel>('panel');
  form = viewChild.required<NgForm>('form');

  isLoading = signal(false);

  onSubmit(): void {
    // TODO
    const { newPassword, currentPassword } = this.form().value;
    console.log(newPassword);
    console.log(currentPassword);
  }

  onCancelClick(): void {
    this.panel()?.close()
  }
}
