import { Component, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { AccountService } from '../../../../shared/services/account.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'ms-bio-form',
  imports: [MatExpansionModule, FormsModule, MatProgressSpinner],
  templateUrl: './bio-form.component.html',
  styleUrl: '../../account.component.scss'
})
export class BioFormComponent {
  accountService = inject(AccountService);

  bio = input.required<string>();

  panel = viewChild<MatExpansionPanel>('panel');
  form = viewChild.required<NgForm>('form');

  isLoading = signal(false);


  onSubmit(): void {
    // TODO
    const { bio } = this.form().value;
    console.log(bio);
  }

  onCancelClick(): void {
    this.panel()?.close()
  }
}
