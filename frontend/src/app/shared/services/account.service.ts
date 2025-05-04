import { inject, Injectable } from '@angular/core';
import { ErrorService } from './error.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  errorService = inject(ErrorService);
  authService = inject(AuthService);

  constructor() { }

  async updateUsername(username: string): Promise<boolean> {
    try {
      console.log(username);

      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }

  async updateUserBio(bio: string): Promise<boolean> {
    try {
      console.log(bio);

      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }

  async updateEmail(email: string, password: string): Promise<boolean> {
    try {
      console.log(email);
      console.log(password);

      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }

  async updatePassword(newPassword: string, currentPassword: string): Promise<boolean> {
    try {
      console.log(newPassword);
      console.log(currentPassword);

      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }

  async deleteAccount(password: string): Promise<boolean> {
    try {
      console.log(password);

      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }
}
