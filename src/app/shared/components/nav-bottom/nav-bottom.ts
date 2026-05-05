import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth';

@Component({
  selector: 'app-nav-bottom',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './nav-bottom.html',
  styleUrl: './nav-bottom.scss',
})
export class NavBottom {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
