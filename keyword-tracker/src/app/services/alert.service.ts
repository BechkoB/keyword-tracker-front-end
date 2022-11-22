import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private zone: NgZone, private snackbar: MatSnackBar) {}
  error(message: string) {
    this.open(message, 'snackbar-error');
  }

  success(message: string) {
    this.open(message, 'snackbar-success');
  }

  private open(message: string, panelClass: string = '') {
    this.zone.run(() => {
      this.snackbar.open(message, '', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass
      });
    });
  }
}
