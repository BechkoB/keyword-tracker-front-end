import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateFilterFn } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { SharedService } from 'src/app/services/shared.service';

interface IDialogData {
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit, AfterViewInit {
  hasError = false;
  dateRange: any;
  start: moment.MomentInput = '';
  end: moment.MomentInput = '';
  endDate = moment().format('YYYY-MM-DD');
  filters: IFilters;

  calendar = new FormGroup({
    start: new FormControl<moment.MomentInput | null>(null),
    end: new FormControl<moment.MomentInput | null>(null)
  });
  ranges = [
    {
      title: '7days',
      dates: {
        end: this.endDate,
        start: moment(this.endDate).subtract(7, 'days').format('YYYY-MM-DD')
      },
      description: 'Last 7 days'
    },
    {
      title: '28days',
      dates: {
        end: this.endDate,
        start: moment(this.endDate).subtract(28, 'days').format('YYYY-MM-DD')
      },
      description: 'Last 28 days'
    },
    {
      title: '3months',
      dates: {
        end: this.endDate,
        start: moment(this.endDate).subtract(3, 'months').format('YYYY-MM-DD')
      },
      description: 'Last 3 months'
    },
    {
      title: '12months',
      dates: {
        end: this.endDate,
        start: moment(this.endDate).subtract(12, 'months').format('YYYY-MM-DD')
      },
      description: 'Last 12 months'
    },
    {
      title: '16months',
      dates: {
        end: this.endDate,
        start: moment(this.endDate).subtract(16, 'months').format('YYYY-MM-DD')
      },
      description: 'Last 16 months'
    },
    { title: 'custom', description: 'Custom' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private sharedSerivce: SharedService
  ) {}

  ngOnInit(): void {
    this.sharedSerivce.getFilters.subscribe(
      (value: IFilters) => (this.filters = value)
    );
    if (this.filters.dates.start === this.start) {
      this.dateRange = this.ranges[0];
    } else {
      this.dateRange = this.ranges.find(
        (item) => item.dates?.start === this.filters.dates.start
      );
    }
  }

  ngAfterViewInit(): void {
    this.start = this.calendar.value.start;
    this.end = this.calendar.value.end;
  }

  onDateChange() {
    this.toggleBtn();
    const { start, end } = this.calendar.value;
    this.start = moment(start).format('YYYY-MM-DD');
    this.end = moment(end).format('YYYY-MM-DD');
    if (this.start > this.end) {
      this.hasError = true;
    } else {
      this.hasError = false;
    }
  }

  dateFilter: DateFilterFn<Date | null> = (d) => {
    const day = d?.getDay();

    /* Return only Monday and Sunday */

    return day !== 2 && day !== 3 && day !== 4 && day !== 5 && day !== 6;
  };

  toggleBtn() {
    this.dateRange = this.ranges.find((item) => item.title === 'custom');
  }
}
