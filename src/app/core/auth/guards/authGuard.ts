import { AuthService } from './../services/auth';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return authService.validateSession().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
