import { Component, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { AccountService } from '../../../../shared/services/account.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'ms-username-form',
  imports: [MatExpansionModule, FormsModule, MatProgressSpinner],
  templateUrl: './username-form.component.html',
  styleUrl: '../../account.component.scss'
})
export class UsernameFormComponent {
  accountService = inject(AccountService);

  username = input.required<string>();

  panel = viewChild<MatExpansionPanel>('panel');
  form = viewChild.required<NgForm>('form');

  isLoading = signal(false);

  onSubmit(): void {
    // TODO
    const { username } = this.form().value;
    console.log(username);
  }

  onCancelClick(): void {
    this.panel()?.close()
  }
}
