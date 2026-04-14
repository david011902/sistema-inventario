import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RegisterRequest,
  RegisterResponse,
} from '../interfaces/AuthInterfaces';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl: string = `${environment.apiUrl}/auth`;
  private readonly ACCESS_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';
  private router = inject(Router);

  //Signals
  private _currentUser = signal<AuthUser | null>(this.loadUserFromStorage());

  readonly currentUser = this._currentUser.asReadonly();
  //Se recalcula automaticamente cada vez que cambia el token
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.role === 'Administrator');
  readonly isEmployee = computed(() => this._currentUser()?.role === 'Employee');

  //Metodos de Auth
  login(request: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, request)
      .pipe(tap((response) => this.saveSession(response)));
  }

  register(request: RegisterRequest) {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, request);
  }

  logout(): void {
    sessionStorage.removeItem(this.ACCESS_KEY);
    sessionStorage.removeItem(this.REFRESH_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  refreshToken() {
    const refreshToken = sessionStorage.getItem(this.REFRESH_KEY);
    if (!refreshToken) {
      this.logout(); // Si no hay refresh token, forza cierre de sesión
      return;
    }
    const body: RefreshRequest = { refreshToken };
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/refresh`, body)
      .pipe(tap((response) => this.saveSession(response)));
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_KEY);
  }

  //Helpers privados
  // Centraliza el guardado de tokens y la actualización del estado del usuario
  private saveSession(response: LoginResponse): void {
    sessionStorage.setItem(this.ACCESS_KEY, response.accessToken);
    sessionStorage.setItem(this.REFRESH_KEY, response.refreshToken);
    // Decodificamos el nuevo token para tener los datos del usuario disponibles inmediatamente
    const user = this.decodeToken(response.accessToken);
    this._currentUser.set(user);
  }

  // Intenta recuperar la sesión al recargar la página
  private loadUserFromStorage(): AuthUser | null {
    const token = sessionStorage.getItem(this.ACCESS_KEY);
    if (!token) return null;

    const user = this.decodeToken(token);
    // Validación de expiración básica: si ya caducó, limpia y retorna null
    if (user.exp * 1000 < Date.now()) {
      sessionStorage.clear();
      return null;
    }
    return user;
  }

  // Decodifica el JWT sin librerías externas.
  // Separa el payload (segunda parte del JWT), lo decodifica de Base64 a JSON
  private decodeToken(token: string): AuthUser {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload)) as AuthUser;
  }
}
