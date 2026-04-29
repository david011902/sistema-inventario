import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBottom } from './shared/components/nav-bottom/nav-bottom';
import { AuthService } from './core/auth/services/auth';

@Component({
  selector: 'app-root',
  imports: [NavBottom, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('sistema-inventario');
  protected authService = inject(AuthService);
  ngOnInit(): void {
    this.authService.validateSession().subscribe();
  }
}
