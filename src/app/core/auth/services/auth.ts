import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  AuthUser,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from '../interfaces/AuthInterfaces';
import { tap, catchError, EMPTY } from 'rxjs';
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

  // las cookies son automáticas
  login(request: LoginRequest) {
    return this.http
      .post<void>(`${this.baseUrl}/login`, request, {
        withCredentials: true, //permite recibir cookies
      })
      .pipe(tap(() => this.validateSession().subscribe()));
  }

  register(request: RegisterRequest) {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, request, {
      withCredentials: true,
    });
  }

  logout(): void {
    this.http.post<void>(`${this.baseUrl}/logout`, {}, { withCredentials: true }).subscribe({
      complete: () => {
        this._currentUser.set(null);
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
  validateSession() {
    return this.http.get<AuthUser>(`${this.baseUrl}/me`, { withCredentials: true }).pipe(
      tap((user) => this._currentUser.set(user)),
      catchError(() => {
        this._currentUser.set(null);
        return EMPTY;
      }),
    );
  }
}
