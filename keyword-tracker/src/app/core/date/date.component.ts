import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, Routes } from '@angular/router';
import * as moment from 'moment';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { SharedService } from 'src/app/services/shared.service';
import { DatePickerComponent } from 'src/app/shared/components/date-picker/date-picker.component';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {
  filters: IFilters;
  hasFilters = false;
  params = new HttpParams();
  type: string;

  constructor(
    private dialog: MatDialog,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.type = this.router.url.replace('/', '');
    this.sharedService.getFilters.subscribe(
      (value: IFilters) => (this.filters = value)
    );
  }

  dateChange() {
    const dialogRef = this.dialog.open(DatePickerComponent, {
      width: '450px',
      height: '540px',
      panelClass: 'date-modal',
      data: this.type
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.hasFilters = true;
        this.filters.dates.start = moment(result.start).format('YYYY-MM-DD');
        this.filters.dates.end = moment(result.end).format('YYYY-MM-DD');
        this.sharedService.setHasFilters = true;
        this.sharedService.setFilters = this.filters;
        this.sharedService.hasFilterSubject.next(true);
      }
    });
  }
}
