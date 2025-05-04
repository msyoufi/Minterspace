import { Component, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { AccountService } from '../../../../shared/services/account.service';

@Component({
  selector: 'ms-username-form',
  imports: [MatExpansionModule, FormsModule],
  templateUrl: './username-form.component.html',
  styleUrl: '../profile-settings.component.scss'
})
export class UsernameFormComponent {
  accountService = inject(AccountService);

  form = viewChild.required<NgForm>('form');

  onSubmit(): void {
    // TODO
    const { username } = this.form().value;
    console.log(username);
  }
}
