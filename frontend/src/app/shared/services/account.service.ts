import { inject, Injectable } from '@angular/core';
import { ErrorService } from './error.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private errorService = inject(ErrorService);

  private BASE_URL = 'http://127.0.0.1:8000/api/user';

  async updateUsername(username: string): Promise<boolean> {
    const url = this.BASE_URL + '/me';

    try {
      const response$ = this.http.patch<User>(url, { username });
      const user = await firstValueFrom(response$);

      this.authService.user$.set(user);

      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }

  async updateUserBio(bio: string): Promise<boolean> {
    const url = this.BASE_URL + '/me';

    try {
      const response$ = this.http.patch<User>(url, { bio });
      const user = await firstValueFrom(response$);
      
      this.authService.user$.set(user);

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
