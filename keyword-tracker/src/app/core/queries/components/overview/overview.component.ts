import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { IQuery } from 'src/app/interfaces/IQueries.interfaces';
import { AlertService } from 'src/app/services/alert.service';
import { HttpService } from 'src/app/services/http.service';
import { QueryService } from 'src/app/services/query.service';
import { SharedService } from 'src/app/services/shared.service';
import { hideLoading, showLoading } from 'src/app/store/actions';
import { SelectionModel } from '@angular/cdk/collections';
import { AddQueryComponent } from 'src/app/shared/components/add-query/add-query.component';
import { FiltersComponent } from 'src/app/shared/components/filters/filters.component';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, AfterViewInit {
  private _destroy$: Subject<any>;
  dataSelect = new SelectionModel<string>(true, []);
  queryColumns: string[] = ['name', 'totalImpressions', 'totalClicks'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  hasFilters = false;
  filters: IFilters;
  totalImpressions: string;
  totalClicks: string;
  avgCtr: number;
  avgPosition: number;
  params = new HttpParams()
    .set('order', '')
    .set('direction', '')
    .set('skip', 0)
    .set('take', 10);
  pageSize = 10;
  length = 0;
  endDate = moment().format('YYYY-MM-DD');
  startDate = moment(this.endDate).subtract(3, 'months').format('YYYY-MM-DD');

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private sharedService: SharedService,
    private dialog: MatDialog,
    private router: Router,
    private httpService: HttpService,
    private route: ActivatedRoute,
    private queryService: QueryService,
    private alert: AlertService,
    private store: Store<{ showLoading: boolean }>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(showLoading());
    this.dataSelect.toggle('clicks');
    this.dataSelect.toggle('impressions');

    this._destroy$ = new Subject<any>();
    this.sharedService.hasFilters
      .pipe(takeUntil(this._destroy$))
      .subscribe((value) => (this.hasFilters = value));
    this.sharedService.getFilters
      .pipe(takeUntil(this._destroy$))
      .subscribe((value: IFilters) => {
        this.filters = value;
        this.setTable();
      });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.store.dispatch(showLoading());
      this.params = this.params.set('order', this.sort.active);
      this.params = this.params.set('direction', this.sort.direction);
    });
  }

  setTable() {
    this.queryService
      .fetchAllQueries(this.params, this.hasFilters, this.filters)
      .pipe(takeUntil(this._destroy$))
      .subscribe((res: any) => {
        if (res.data === undefined) {
          return;
        }
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.sort = this.sort;
        this.length = res.length;
        if (res.results) {
          this.totalImpressions = res.results.totalImpressions;
          this.totalClicks = res.results.totalClicks;
          this.avgPosition = res.results.avgPosition;
          this.avgCtr = res.results.avgCtr;
        }
        this.store.dispatch(hideLoading());
      });
  }

  searchQuery(event: Event): void {
    this.store.dispatch(showLoading());
    const filterValue = (event.target as HTMLInputElement).value;
    this.filters.query = filterValue.trim().toLowerCase();
    this.hasFilters = true;
    this.setTable();
    if (this.dataSource.paginator) {
      this.paginator.pageIndex = 0;
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearchField(input: HTMLInputElement) {
    this.store.dispatch(showLoading());
    input.value = '';
    this.resetFilters();
  }

  details(row: any) {
    this.router.navigateByUrl(`queries/details/${row.query_id}`);
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(showLoading());
    const skip = event.pageIndex === 0 ? 0 : event.pageIndex * event.pageSize;
    this.params = this.params.set('skip', skip).set('take', event.pageSize);
    console.log(this.params);
    this.setTable();
  }

  queryFilters() {
    const dialogRef = this.dialog.open(FiltersComponent, {
      width: '550px',
      height: '550px',
      data: 'queries'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.query = '';
        this.hasFilters = true;
        this.sharedService.setHasFilters = true;
        this.sharedService.filtersSubject.next(result);
      }
    });
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
    this.setTable();
  }

  addQuery(): void {
    this.dialog.open(AddQueryComponent, {
      width: '800px',
      height: '500px'
    });
  }

  showOrHideItem(event: any, from: string) {
    this.dataSelect.toggle(from);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    const index = this.queryColumns.indexOf(from);
    if (index !== -1) {
      this.queryColumns.splice(index, 1);
    } else {
      this.queryColumns.push(from);
    }
  }
}
