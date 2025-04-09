import { Component, inject, signal, viewChild } from '@angular/core';
import { PasswordEyeComponent } from "../../shared/components/password-eye.component";
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthModalService } from './auth-modal.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { EscapePressDirective } from '../../shared/directives/escape-press.directive';

@Component({
  selector: 'ms-auth-modal',
  imports: [PasswordEyeComponent, ClickOutsideDirective, EscapePressDirective, MatProgressSpinner, FormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})
export class AuthModalComponent {
  authModel = inject(AuthModalService);
  router = inject(Router);

  form = viewChild.required<NgForm>('form');

  isLogin = signal(true);
  isLoading = signal(false);

  onSubmit(): void {
    this.isLoading.set(true);
    const forwardURL = this.authModel.forwardURL;

    console.log(this.form().value);
    console.log(forwardURL);

    // this.router.navigateByUrl(forwardURL);
    // this.authModel.close();
  }

  onLoginClick(): void {
    this.isLogin.set(true);
  }

  onSignupClick(): void {
    this.isLogin.set(false);
  }

  toggleIsLogin(): void {
    this.isLogin.set(!this.isLogin());
  }

  closeModal(): void {
    this.authModel.close();
  }
}