import { Component, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { AccountService } from '../../../../shared/services/account.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';

@Component({
  selector: 'ms-bio-form',
  imports: [MatExpansionModule, FormsModule, MatProgressSpinner],
  templateUrl: './bio-form.component.html',
  styleUrl: '../../account.component.scss'
})
export class BioFormComponent {
  accountService = inject(AccountService);
  confirmDialog = inject(ConfirmDialogService);
  snackbar = inject(SnackBarService);

  bio = input.required<string>();
  panel = viewChild<MatExpansionPanel>('panel');
  form = viewChild.required<NgForm>('form');
  isLoading = signal(false);

  async onSubmit(): Promise<void> {
    const { bio } = this.form().value;

    if (this.bio() && !bio) {
      const confrim = await this.confirmDialog.open({
        title: 'Remove Current Bio',
        message: 'Saving an empty bio will remove the current one!',
        actionButton: 'Remove Bio'
      });

      if (!confrim) return;
    }

    this.updateBio(bio);
  }

  async updateBio(bio: string): Promise<void> {
    this.isLoading.set(true);

    const result = await this.accountService.updateUserBio(bio);

    this.isLoading.set(false);

    if (!result) return;

    this.snackbar.show('Bio Changed', 'green');
    this.closePanel();
  }

  closePanel(): void {
    this.panel()?.close()
  }
}
