import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
  MatDialogModule,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ConfirmDialog>);

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
