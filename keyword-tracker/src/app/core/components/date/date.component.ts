import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { KeywordService } from 'src/app/services/keyword.service';
import { showLoading } from 'src/app/store/actions';
import { DatePickerComponent } from '../../pages/date-picker/date-picker.component';
import { KeywordsComponent } from '../keywords/keywords.component';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {
  filters: IFilters;
  hasFilters = false;
  params = new HttpParams();

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('paginator') paginator: MatPaginator;
  constructor(
    private dialog: MatDialog,
    private store: Store<{ showLoading: boolean }>,
    private keywordService: KeywordService,
    private keywordComponent: KeywordsComponent
  ) {}

  ngOnInit(): void {
    this.keywordService.getFilters.subscribe(
      (value: IFilters) => (this.filters = value)
    );
  }

  dateChange() {
    const dialogRef = this.dialog.open(DatePickerComponent, {
      width: '450px',
      height: '540px',
      panelClass: 'date-modal'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.hasFilters = true;
        this.filters.dates.start = moment(result.start).format('YYYY-MM-DD');
        this.filters.dates.end = moment(result.end).format('YYYY-MM-DD');
        this.keywordService.setFilters = this.filters;
        this.store.dispatch(showLoading());
        this.params = this.params.set('skip', 0);
        this.keywordService.fetchAll(this.params, true, this.filters);
        console.log(this.paginator);
        this.paginator.pageIndex = 0;
        this.paginator?.firstPage();
        console.log(this.filters);
      }
    });
  }
}
