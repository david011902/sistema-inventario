import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

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
  private dialog = inject(MatDialog);

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Cerrar sesión',
        message: '¿Estás seguro de que deseas salir?',
        confirmText: 'Salir',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.authService.logout();
      }
    });
  }
}
