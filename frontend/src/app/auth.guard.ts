import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  if (!authService.user$()) {
    const url = state.url.includes('account') ? '/' : state.url;
    authService.openAuthModal(url);
    return false;
  }

  return true;
};
