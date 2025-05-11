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

  private BASE_URL = 'http://127.0.0.1:8000/api/user/me';

  async updateUsername(username: string): Promise<boolean> {
    try {
      const response$ = this.http.patch<User>(this.BASE_URL, { username });
      const user = await firstValueFrom(response$);

      this.authService.user$.set(user);

      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }

  async updateUserBio(bio: string): Promise<boolean> {
    try {
      const response$ = this.http.patch<User>(this.BASE_URL, { bio });
      const user = await firstValueFrom(response$);

      this.authService.user$.set(user);

      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }

  async updateEmail(email: string, password: string): Promise<boolean> {
    const url = this.BASE_URL + '/email';

    try {
      const response$ = this.http.post<void>(url, { email, password });
      await firstValueFrom(response$);

      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }

  async updatePassword(new_password: string, current_password: string): Promise<boolean> {
    const url = this.BASE_URL + '/password';

    try {
      const response$ = this.http.post<void>(url, { new_password, current_password });
      await firstValueFrom(response$);

      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }

  async deleteAccount(password: string): Promise<boolean> {
    const url = this.BASE_URL + '/delete';

    try {
      const response$ = this.http.post<void>(url, { password });
      await firstValueFrom(response$);

      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }
}
