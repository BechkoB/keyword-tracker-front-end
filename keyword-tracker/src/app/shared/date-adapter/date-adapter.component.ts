import { NativeDateAdapter } from '@angular/material/core';

export class DateAdapterComponent extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }
}
