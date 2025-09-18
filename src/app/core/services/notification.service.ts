import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  success(message: string, action: string = 'Close', duration: number = 4000): void {
    this.show(message, 'success', action, duration);
  }

  error(message: string, action: string = 'Close', duration: number = 6000): void {
    this.show(message, 'error', action, duration);
  }

  private show(
    message: string, 
    type: 'success' | 'error', 
    action: string, 
    duration: number
  ): void {
    const config: MatSnackBarConfig = {
      ...this.defaultConfig,
      duration,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',};

    this.snackBar.open(message, action, config);
  }
}