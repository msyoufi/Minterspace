import { Component, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { AccountService } from '../../../../shared/services/account.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'ms-delete-account-form',
  imports: [MatExpansionModule, FormsModule, MatProgressSpinner],
  templateUrl: './delete-account-form.component.html',
  styleUrl: '../../account.component.scss'
})
export class DeleteAccountFormComponent {
  accountService = inject(AccountService);

  panel = viewChild<MatExpansionPanel>('panel');
  form = viewChild.required<NgForm>('form');

  isLoading = signal(false);

  onSubmit(): void {
    // TODO
    const { password } = this.form().value;
    console.log(password);
  }

  onCancelClick(): void {
    this.panel()?.close()
  }
}
