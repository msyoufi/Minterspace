import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
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
import { PortfolioService } from '../../shared/services/portfolio.service';

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
  portfolioService = inject(PortfolioService);
  router = inject(Router);

  form = new FormGroup<AuthFormGroup>({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  emailInput = viewChild.required<ElementRef<HTMLInputElement>>('emailInput');
  isLogin = signal(true);
  isLoading = signal(false);
  formError = signal<string | null>(null);

  constructor() {
    effect(() => this.emailInput().nativeElement.focus());
  }

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

    // Only the first watchlist and portfolio on account creation musst be set to main.
    await this.watchlistService.createWatchlist('Main', true);
    await this.portfolioService.createPortfolio('Main', true);
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
    this.emailInput().nativeElement.focus();
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