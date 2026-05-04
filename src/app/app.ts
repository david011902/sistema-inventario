import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBottom } from './shared/components/nav-bottom/nav-bottom';
import { AuthService } from './core/auth/services/auth';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EMPTY, catchError } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [NavBottom, RouterOutlet, MatProgressSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('sistema-inventario');
  protected authService = inject(AuthService);
  ngOnInit(): void {
    this.authService
      .validateSession()
      .pipe(
        catchError(() => EMPTY), // Ignora el error aquí porque el guard/interceptor ya redirigen
      )
      .subscribe();
  }
}
