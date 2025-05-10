import { Component, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { AccountService } from '../../../../shared/services/account.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';

@Component({
  selector: 'ms-bio-form',
  imports: [MatExpansionModule, FormsModule, MatProgressSpinner],
  templateUrl: './bio-form.component.html',
  styleUrl: '../../account.component.scss'
})
export class BioFormComponent {
  accountService = inject(AccountService);
  snackbar = inject(SnackBarService);

  bio = input.required<string>();
  panel = viewChild<MatExpansionPanel>('panel');
  form = viewChild.required<NgForm>('form');
  isLoading = signal(false);

  async onSubmit(): Promise<void> {
    if (this.form().invalid) return;

    this.isLoading.set(true);

    const { bio } = this.form().value;
    const result = await this.accountService.updateUserBio(bio);

    this.isLoading.set(false);

    if (!result) return;

    this.snackbar.show('Username Changed', 'green');
    this.closePanel();
  }

  closePanel(): void {
    this.panel()?.close()
  }
}
