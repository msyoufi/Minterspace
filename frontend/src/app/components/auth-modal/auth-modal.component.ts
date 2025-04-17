import { Component, inject, signal } from '@angular/core';
import { PasswordEyeComponent } from "../../shared/components/password-eye.component";
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EscapePressDirective } from '../../shared/directives/escape-press.directive';
import MsValidators from '../../shared/utils/ms.validators';
import { AuthService } from '../../shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WatchlistService } from '../../shared/services/watchlist.service';

interface AuthFormGroup {
  email: FormControl<string | null>,
  password: FormControl<string | null>,
  isAgreed?: FormControl<boolean | null>
};

@Component({
  selector: 'ms-auth-modal',
  imports: [PasswordEyeComponent, ClickOutsideDirective, EscapePressDirective, MatProgressSpinner, ReactiveFormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})
export class AuthModalComponent {
  authService = inject(AuthService);
  watchlistService = inject(WatchlistService);
  router = inject(Router);

  form = new FormGroup<AuthFormGroup>({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  isLogin = signal(true);
  isLoading = signal(false);
  formError = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    this.formError.set(null);

    if (this.form.invalid) {
      this.formError.set('Please ensure all fields are valid');
      return;
    }

    const { email, password } = this.form.value;

    const result = await this.authenticateUser(email!, password!);
    if (!result) return;

    this.router.navigateByUrl(this.authService.forwardURL);
    this.authService.closeAuthModal();
    console.log('Success');
  }

  async authenticateUser(email: string, password: string): Promise<boolean> {
    this.isLoading.set(true);

    try {
      this.isLogin()
        ? await this.authService.login(email, password)
        : await this.createUserAccount(email, password);

      return true;

    } catch (err: unknown) {
      this.handleAuthErrors(err);
      return false;

    } finally {
      this.isLoading.set(false);
    }
  }

  async createUserAccount(email: string, password: string): Promise<void> {
    await this.authService.register(email, password);

    // Only the first watchlist on account creation musst be set as main watchlist.
    await this.watchlistService.createWatchlist('Main', true);
  }

  handleAuthErrors(err: unknown): void {
    // TODO
    if (err instanceof HttpErrorResponse) {
      const emailErr = err.error.email;

      if (emailErr)
        this.formError.set(emailErr[0]);
      else
        this.formError.set(err.error.detail);
    }
  }

  onLoginClick(): void {
    this.isLogin.set(true);
  }

  onSignupClick(): void {
    this.isLogin.set(false);
  }

  switchForm(): void {
    this.isLogin.set(!this.isLogin());
    this.formError.set(null);
    this.toggleIsAgreedControl();
    this.toggelPasswordValidators();
  }

  toggleIsAgreedControl(): void {
    const hasControl = this.form.contains('isAgreed');
    const isAgreedControl = new FormControl(false, Validators.requiredTrue);

    if (!this.isLogin() && !hasControl)
      this.form.addControl('isAgreed', isAgreedControl);

    else if (this.isLogin() && hasControl)
      this.form.removeControl('isAgreed');
  }

  toggelPasswordValidators(): void {
    const passwordControl = this.form.get('password')!;

    if (this.isLogin())
      passwordControl.removeValidators([Validators.minLength(8), MsValidators.password]);
    else
      passwordControl.setValidators([Validators.minLength(8), MsValidators.password]);
  }

  closeModal(): void {
    this.authService.closeAuthModal();
  }
}