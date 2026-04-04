import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { AlertDialogComponent } from '../../shared/components/alert/alert';
import { NotificationDialogComponent } from '../../shared/components/notification/notification';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialog = inject(MatDialog);

  confirm(data: { title: string; message: string; confirmText?: string }) {
    return this.dialog
      .open(ConfirmDialog, {
        width: '90%',
        maxWidth: '400px',
        data,
      })
      .afterClosed();
  }

  alert(data: { title: string; message: string; buttonText?: string }) {
    return this.dialog
      .open(AlertDialogComponent, {
        width: '90%',
        maxWidth: '400px',
        data: { ...data, type: 'error' },
        disableClose: true,
      })
      .afterClosed();
  }

  success(data: { title: string; message: string }) {
    return this.dialog
      .open(NotificationDialogComponent, {
        width: '90%',
        maxWidth: '400px',
        data: { ...data, type: 'success' },
      })
      .afterClosed();
  }

  showApiError(err: any, title: string = 'Error en la operación') {
    const message = this.extractErrorMessage(err);

    return this.dialog
      .open(AlertDialogComponent, {
        width: '400px',
        data: { title, message },
        disableClose: true,
      })
      .afterClosed();
  }
  private extractErrorMessage(err: any): string {
    // Caso de error personalizado
    if (err.error?.error && typeof err.error.error === 'string') {
      return err.error.error;
    }

    // Caso de ValidationProblemDetails
    if (err.error?.errors) {
      const messages: string[] = [];
      for (const key in err.error.errors) {
        messages.push(...err.error.errors[key]);
      }
      return messages.join('\n');
    }

    //Caso de error simple de texto o mensaje de conexión
    if (typeof err.error === 'string') return err.error;

    return err.message || 'Error inesperado en el servidor.';
  }
}
