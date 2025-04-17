import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.user$()) {
    const url = state.url.includes('account') ? '/' : state.url;

    authService.openAuthModal(url);
    router.navigateByUrl('/');

    return false;
  }

  return true;
};
