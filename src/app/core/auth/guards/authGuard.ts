import { AuthService } from './../services/auth';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya tenemos al usuario en memoria, pasa directo
  if (authService.isLoggedIn()) {
    return true;
  }

  // Si no está en memoria, intenta validar con la cookie
  return authService.validateSession().pipe(
    map(() => true),
    catchError(() => {
      // Si falla /me, intenta refresh
      return authService.refreshToken().pipe(
        switchMap(() => authService.validateSession()),
        map(() => true),
        catchError(() => {
          // Si todo falla, al login
          return of(router.createUrlTree(['/login']));
        }),
      );
    }),
  );
};
