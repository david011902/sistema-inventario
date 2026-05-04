import { AuthService } from './../services/auth';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isInitializing()) {
    return authService.isLoggedIn() ? true : router.createUrlTree(['/login']);
  }

  // Si todavía está inicializando, esperar a que termine
  return toObservable(authService.isInitializing).pipe(
    filter((initializing) => !initializing),
    take(1),
    map(() => (authService.isLoggedIn() ? true : router.createUrlTree(['/login']))),
  );
};
