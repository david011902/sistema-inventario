import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // Clonar el request y agregar el Bearer token si existe
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el servidor responde 401 (token expirado), intentar refresh
      if (error.status === 401) {
        const refresh$ = authService.refreshToken();
        if (refresh$) {
          return refresh$.pipe(
            switchMap(() => {
              // Reintentar el request original con el nuevo token
              const newToken = authService.getAccessToken();
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(retryReq);
            }),
            catchError(() => {
              // Si el refresh tambien falla, cerrar sesion
              authService.logout();
              return throwError(() => error);
            }),
          );
        }
        authService.logout();
      }
      return throwError(() => error);
    }),
  );
};
