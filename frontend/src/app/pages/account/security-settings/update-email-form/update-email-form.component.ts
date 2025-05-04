import { Component, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { AccountService } from '../../../../shared/services/account.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'ms-update-email-form',
  imports: [MatExpansionModule, FormsModule, MatProgressSpinner],
  templateUrl: './update-email-form.component.html',
  styleUrl: '../../account.component.scss'
})
export class UpdateEmailFormComponent {
  accountService = inject(AccountService);

  email = input.required<string>();

  panel = viewChild<MatExpansionPanel>('panel');
  form = viewChild.required<NgForm>('form');

  isLoading = signal(false);

  onSubmit(): void {
    // TODO
    const { email, password } = this.form().value;
    console.log(email);
    console.log(password);
  }

  onCancelClick(): void {
    this.panel()?.close()
  }
}
