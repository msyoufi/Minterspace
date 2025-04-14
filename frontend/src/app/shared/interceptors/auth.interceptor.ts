import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const apiUrl = authService.baseUrl;
  const accessToken = authService.getAccessToken();

  if (req.url.startsWith(apiUrl) && accessToken)
    req = setTokenHeader(req, accessToken);

  return next(req).pipe(catchError(err => {
    if (err instanceof HttpErrorResponse && err.error.code === 'token_not_valid') {
      if (req.url.endsWith('user/token/refresh')) // Refresh token is expired
        authService.logout();

      else // Access token is expired
        return authService.refreshAccessToken()
          .pipe(switchMap(token => next(setTokenHeader(req, token.access))))
    }

    return throwError(() => err);
  }));
}

function setTokenHeader(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
}