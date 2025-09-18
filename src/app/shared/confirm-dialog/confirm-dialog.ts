import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ConfirmDialogData } from '../../core/models/confirm-dialog.models';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialog>);
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  getIcon(): string {
    switch (this.data.type) {
      case 'warning':
        return 'warning';
      case 'danger':
        return 'delete';
      case 'info':
      default:
        return 'info';
    }
  }

  getIconClass(): string {
    return this.data.type || 'info';
  }

  getConfirmButtonClass(): string {
    return `confirm-button ${this.data.type || 'info'}`;
  }
}
