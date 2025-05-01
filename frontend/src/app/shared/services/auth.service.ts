import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, filter, firstValueFrom, Observable, take, tap, throwError, timeout } from 'rxjs';
import { ErrorService } from './error.service';

interface RegisterResponse {
  user: User,
  tokens: AuthTokens
};

interface AuthTokens {
  access: string,
  refresh?: string
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private errorService = inject(ErrorService);

  public user$ = signal<User | null>(null);
  public isAuthModalOpen$ = signal<boolean>(false);
  public forwardURL = '';

  private refreshTokenSubject = new BehaviorSubject<{ access: string } | null>(null);
  private isRefreshingToken = false;
  private BASE_URL = 'http://127.0.0.1:8000/api/user';

  get baseUrl(): string {
    return this.BASE_URL;
  }

  async setCurrentUser(): Promise<boolean> {
    if (!this.getAccessToken()) {
      this.user$.set(null);
      return true;
    }

    const url = `${this.BASE_URL}/me`;

    try {
      const response$ = this.http.get<User>(url).pipe(timeout(10000));
      const user = await firstValueFrom(response$);

      this.user$.set(user);
      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }

  async register(email: string, password: string): Promise<void> {
    const url = `${this.BASE_URL}/register`;
    const body = { email, password };

    const response$ = this.http.post<RegisterResponse>(url, body).pipe(timeout(10000));
    const { user, tokens } = await firstValueFrom(response$);

    this.storeTokens(tokens);
    this.user$.set(user);
  }

  async login(email: string, password: string): Promise<void> {
    const url = `${this.BASE_URL}/token`;
    const body = { email, password };

    const response$ = this.http.post<AuthTokens>(url, body).pipe(timeout(10000));
    const tokens = await firstValueFrom(response$);

    this.storeTokens(tokens);
    const result = await this.setCurrentUser();

    if (!result)
      throw new Error('Log in faild');
  }

  logout(): void {
    this.clearTokens();
    this.user$.set(null);
    this.isRefreshingToken = false;
    this.refreshTokenSubject.next(null);
    this.router.navigateByUrl('/');
  }

  refreshAccessToken(): Observable<{ access: string }> {
    const url = `${this.BASE_URL}/token/refresh`;
    const refresh = this.getRefreshToken();

    if (!refresh) {
      this.logout();
      return throwError(() => new Error("Unauthorized: No refresh token available."));
    }

    if (this.isRefreshingToken) // Ongoing refreshing request
      return this.refreshTokenSubject.pipe(
        filter(token => !!token),
        take(1)
      );

    // Start refreshing token
    this.isRefreshingToken = true;
    this.refreshTokenSubject.next(null);

    return this.http.post<{ access: string }>(url, { refresh }).pipe(
      timeout(10000),
      tap(token => {
        this.isRefreshingToken = false;
        this.refreshTokenSubject.next(token);
        this.storeTokens(token);
      })
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh');
  }

  storeTokens(tokens: AuthTokens): void {
    localStorage.setItem('access', tokens.access);

    if (tokens.refresh)
      localStorage.setItem('refresh', tokens.refresh);
  }

  clearTokens(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  openAuthModal(forwardURL: string): void {
    this.isAuthModalOpen$.set(true);
    this.forwardURL = forwardURL;
  }

  closeAuthModal(): void {
    this.isAuthModalOpen$.set(false);
    this.forwardURL = '';
  }
}