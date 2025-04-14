import { Component, DestroyRef, inject, signal } from '@angular/core';
import { PasswordEyeComponent } from "../../shared/components/password-eye.component";
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthModalService } from './auth-modal.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EscapePressDirective } from '../../shared/directives/escape-press.directive';
import MsValidators from '../../shared/utils/ms.validators';
import { AuthService } from '../../shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  authModel = inject(AuthModalService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);

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
    this.isLoading.set(true);

    try {
      if (this.isLogin())
        await this.authService.login(email!, password!);
      else
        await this.authService.register(email!, password!);

      this.router.navigateByUrl(this.authModel.forwardURL);
      this.authModel.close();
      console.log('Success');

    } catch (err: unknown) {
      if (err instanceof HttpErrorResponse) {
        const emailErr = err.error.email;

        if (emailErr)
          this.formError.set(emailErr[0]);
        else
          this.formError.set(err.error.detail);
      }

    } finally {
      this.isLoading.set(false);
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
    this.authModel.close();
  }
}