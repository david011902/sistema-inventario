import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // El navegador envia las cookies en automatico
  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isRefreshUrl = req.url.includes('/auth/refresh');

      if (error.status === 401 && !isRefreshUrl) {
        return authService.refreshToken().pipe(
          switchMap(() => next(authReq)), // reintenta con las nuevas cookies
          catchError(() => {
            authService.logout();
            return throwError(() => error);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
