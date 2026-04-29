import { AuthService } from './../services/auth';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya hay usuario en memoria, pasar directo
  if (authService.isLoggedIn()) {
    return true;
  }

  // Si no, intenta recuperar sesión antes de decidir
  return authService.validateSession().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
