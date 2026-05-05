import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../interfaces/AuthInterfaces';
import { tap, catchError, EMPTY, throwError, share, finalize, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl: string = `${environment.apiUrl}/auth`;
  private router = inject(Router);

  // Signals
  private _currentUser = signal<AuthUser | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.role === 'Administrator');
  readonly isEmployee = computed(() => this._currentUser()?.role === 'Employee');
  private _isInitializing = signal<boolean>(true);
  readonly isInitializing = this._isInitializing.asReadonly();
  private sessionCheck$?: Observable<AuthUser>;
  // las cookies son automáticas
  login(request: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, request, { withCredentials: true })
      .pipe(tap((response) => this._currentUser.set(response.user)));
  }

  register(request: RegisterRequest) {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, request, {
      withCredentials: true,
    });
  }

  logout(): void {
    this.http
      .post<void>(`${this.baseUrl}/logout`, {}, { withCredentials: true })
      .pipe(catchError(() => EMPTY))
      .subscribe({
        complete: () => {
          this._currentUser.set(null); // limpiar después de que el servidor confirmó
          this.router.navigate(['/login']);
        },
      });
  }

  refreshToken() {
    return this.http.post<void>(
      `${this.baseUrl}/refresh`,
      {},
      { withCredentials: true }, //envía cookie de refresh automáticamente
    );
  }

  // para recuperar sesión al iniciar la app
  validateSession(): Observable<AuthUser> {
    if (this.sessionCheck$) {
      return this.sessionCheck$;
    }

    this.sessionCheck$ = this.http
      .get<AuthUser>(`${this.baseUrl}/me`, { withCredentials: true })
      .pipe(
        tap((user) => this._currentUser.set(user)),
        catchError((err) => {
          this._currentUser.set(null);
          return throwError(() => err);
        }),
        finalize(() => {
          this._isInitializing.set(false); // un solo lugar, siempre se ejecuta
          this.sessionCheck$ = undefined;
        }),
        share(), //debe ser el último operador
      );

    return this.sessionCheck$;
  }
}
