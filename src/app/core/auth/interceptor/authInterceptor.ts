import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable } from 'rxjs';
import { AuthService } from '../services/auth';

let isRefreshing = false;
let refreshSubject = new BehaviorSubject<boolean | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        return handle401(req, next, authService);
      }
      return throwError(() => error);
    }),
  );
};

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(() => {
        isRefreshing = false;
        refreshSubject.next(true);
        return next(req.clone({ withCredentials: true }));
      }),
      catchError((err) => {
        isRefreshing = false;
        refreshSubject.next(false);
        authService.logout();
        return throwError(() => err);
      }),
    );
  }

  return refreshSubject.pipe(
    filter((result): result is boolean => result !== null), // type guard
    take(1),
    switchMap((success) => {
      if (success) {
        return next(req.clone({ withCredentials: true }));
      }
      return throwError(() => new Error('Refresh failed'));
    }),
  );
}
