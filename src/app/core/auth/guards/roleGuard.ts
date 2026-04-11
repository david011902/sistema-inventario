import { AuthService } from './../services/auth';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

// Uso: canActivate: [authGuard, roleGuard('Administrator')]
export const roleGuard = (requiredRole: 'Employee' | 'Administrator'): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();

    if (user?.role === requiredRole) {
      return true;
    }

    // Autenticado pero sin el rol requerido: redirigir al dashboard
    return router.createUrlTree(['/dashboard']);
  };
};
