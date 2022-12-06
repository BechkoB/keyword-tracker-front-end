import { HttpParams } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subject, take, takeUntil } from 'rxjs';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { QueryService } from 'src/app/services/query.service';
import { SharedService } from 'src/app/services/shared.service';
import { hideLoading, showLoading } from 'src/app/store/actions';
import { SelectionModel } from '@angular/cdk/collections';
import { IQuery } from 'src/app/interfaces/IQueries.interfaces';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AlertService } from 'src/app/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { FiltersComponent } from 'src/app/shared/components/filters/filters.component';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-queries',
  templateUrl: './new-queries.component.html',
  styleUrls: ['./new-queries.component.scss']
})
export class NewQueriesComponent implements OnInit, AfterViewInit, OnDestroy {
  select = new SelectionModel<IQuery>(true, []);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hasFilters = false;
  endDate = moment().format('YYYY-MM-DD');
  startDate = moment(this.endDate).subtract(3, 'months').format('YYYY-MM-DD');
  private _destroy$: Subject<any>;
  filters: IFilters;
  params = new HttpParams()
    .set('order', '')
    .set('direction', '')
    .set('skip', 0)
    .set('take', 10);

  pageSize = 10;
  length = 0;
  queryColumns: string[] = [
    'select',
    'name',
    'totalImpressions',
    'totalClicks',
    'avgPosition',
    'avgCtr'
  ];
  dataSource: any;

  constructor(
    private sharedService: SharedService,
    private queryService: QueryService,
    private alert: AlertService,
    private dialog: MatDialog,
    private router: Router,
    private store: Store<{ showLoading: boolean }>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(showLoading());
    this._destroy$ = new Subject<any>();
    this.sharedService.hasFilters
      .pipe(takeUntil(this._destroy$))
      .subscribe((value) => (this.hasFilters = value));
    this.sharedService.getFilters
      .pipe(takeUntil(this._destroy$))
      .subscribe((value: IFilters) => {
        this.filters = value;
        this.fetchData();
      });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.store.dispatch(showLoading());
      this.params = this.params.set('order', this.sort.active);
      this.params = this.params.set('direction', this.sort.direction);
      this.fetchData();
    });
  }

  queryFilters() {
    const dialogRef = this.dialog.open(FiltersComponent, {
      width: '550px',
      height: '550px',
      data: 'queries'
    });
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     result.query = '';
    //     this.sharedService.filtersSubject.next(result);
    //   }
    // });
  }

  fetchData() {
    this.queryService
      .getNewQueries(this.params, this.filters)
      .pipe(takeUntil(this._destroy$))
      .subscribe((results) => {
        this.length = results.length;
        this.dataSource = results.data;
        this.dataSource.paginator = this.paginator;
        this.store.dispatch(hideLoading());
      });
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(showLoading());
    const skip = event.pageIndex === 0 ? 0 : event.pageIndex * event.pageSize;
    this.params = this.params.set('skip', skip).set('take', event.pageSize);
    this.fetchData();
  }

  searchQuery(event: Event): void {
    this.store.dispatch(showLoading());
    const filterValue = (event.target as HTMLInputElement).value;
    this.hasFilters = true;
    this.filters.query = filterValue.trim().toLowerCase();
    this.fetchData();
    if (this.dataSource.paginator) {
      this.paginator.pageIndex = 0;
      this.dataSource.paginator.firstPage();
    }
  }

  details(row: any) {
    this.router.navigateByUrl(`queries/details/${row.query_id}`);
  }

  isAllSelected() {
    const numSelected = this.select.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  selectAll(event: MatCheckboxChange) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isAllSelected()
      ? this.select.clear()
      : this.dataSource.forEach((query: IQuery) => {
          this.select.select(query);
        });
  }

  updateRelevant(relevant: boolean) {
    this.store.dispatch(showLoading());

    return this.queryService
      .bulkEdit(this.select.selected, relevant)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.alert.success('Edited successfully');
          this.fetchData();
          this.select.clear();
          this.store.dispatch(hideLoading());
        },
        error: (err) => {
          console.error(err);
          this.alert.error('Error while editing...Please try again later');
          this.store.dispatch(hideLoading());
        }
      });
  }

  clearSearchField(input: HTMLInputElement) {
    this.store.dispatch(showLoading());
    input.value = '';
    this.resetFilters();
  }

  resetFilters() {
    this.store.dispatch(showLoading());
    this.sharedService.setFilters = {
      esv: { from: 0, to: 0 },
      position: { from: 0, to: 0 },
      impressions: { from: 0, to: 0 },
      dates: { start: this.startDate, end: this.endDate },
      relevant: null,
      queryTyp: '',
      query: ''
    };
    this.params = this.params.set('skip', 0);
    this.sharedService.hasFilterSubject.next(false);
    this.fetchData();
  }

  ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }
}
