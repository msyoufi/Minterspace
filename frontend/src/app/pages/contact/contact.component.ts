import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import WEB3FORMS_API_KEY from '../../../secrets/web3-forms-api-key';

@Component({
  selector: 'ms-contact',
  imports: [FormsModule, MatProgressSpinner],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  http = inject(HttpClient);
  snackbar = inject(SnackBarService);

  URL = 'https://api.web3forms.com/submit';

  form = viewChild.required<NgForm>('form');
  nameInput = viewChild.required<ElementRef<HTMLInputElement>>('nameInput');
  isLoading = signal(false);

  constructor() {
    effect(() => this.nameInput().nativeElement.focus());
  }

  async onSubmit(): Promise<void> {
    if (this.form().invalid) {
      this.snackbar.show('Please fill the required fields', 'red', 2000);
      return;
    }

    this.isLoading.set(true);

    const message = Object.assign(this.form().value, {
      source: 'Minterspace',
      access_key: WEB3FORMS_API_KEY
    });

    try {
      const source = this.http.post<any>(this.URL, message);
      const res = await firstValueFrom(source);

      if (!res.success)
        throw new Error();

      this.form().reset();
      this.snackbar.show('Your message was submitted successfully', 'green', 4000);

    } catch (err: unknown) {
      this.snackbar.show('Something went wrong!. Please try again later', 'red', 4000);

    } finally {
      this.isLoading.set(false);
    }
  }
}
