import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-alert',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class AlertDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string; buttonText?: string },
  ) {}
}
