import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private snackbar = inject(SnackBarService);

  handleError(err: unknown): void {
    let message = 'An unexpected error occurred.';

    if (err instanceof HttpErrorResponse) {
      const error = err.error;

      if (typeof error?.detail === 'string') {
        message = error.detail;

      } else if (typeof error === 'object') {
        const firstError = Object.values(error).flat()[0];

        message = typeof firstError === 'string'
          ? firstError
          : `HTTP Error: ${err.status} - ${err.statusText}`;

      } else if (typeof error === 'string') {
        message = error;

      } else {
        message = `HTTP Error: ${err.status} - ${err.statusText}`;
      }

    } else if (err instanceof Error) {
      message = err.message;
    }

    this.snackbar.show(message, 'red', 5000);
  }
}
