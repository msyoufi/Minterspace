import { Component, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { AccountService } from '../../../../shared/services/account.service';

@Component({
  selector: 'ms-bio-form',
  imports: [MatExpansionModule, FormsModule],
  templateUrl: './bio-form.component.html',
  styleUrl: '../profile-settings.component.scss'
})
export class BioFormComponent {
  accountService = inject(AccountService);

  form = viewChild.required<NgForm>('form');

  onSubmit(): void {
    // TODO
    const { bio } = this.form().value;
    console.log(bio);
  }
}
