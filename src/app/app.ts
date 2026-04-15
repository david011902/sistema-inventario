import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBottom } from './shared/components/nav-bottom/nav-bottom';
import { AuthService } from './core/auth/services/auth';

@Component({
  selector: 'app-root',
  imports: [NavBottom, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('sistema-inventario');
  protected authService = inject(AuthService);
}
