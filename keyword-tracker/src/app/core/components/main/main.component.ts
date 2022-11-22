import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { HttpParams } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddQueryComponent } from '../../pages/add-query/add-query.component';
import { FiltersComponent } from '../../pages/filters/filters.component';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { Store } from '@ngrx/store';
import { hideLoading, showLoading } from 'src/app/store/actions';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { IPage } from 'src/app/interfaces/IPages.interfaces';
import { HttpService } from 'src/app/services/http.service';
import { AlertService } from 'src/app/services/alert.service';
import { IQuery } from 'src/app/interfaces/IQueries.interfaces';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { QueryService } from 'src/app/services/query.service';

interface Checks {
  name: string;
  completed: boolean;
  color: string;
  checkboxes: { id: number; checked: boolean | null }[];
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  relevantSelect = new SelectionModel<IQuery>(true, []);
  irrelevantSelect = new SelectionModel<IQuery>(true, []);

  type = '';
  private _destroy$: Subject<any>;
  hasFilters = false;
  queryColumns: string[] = [
    'relevant',
    'irrelevant',
    'name',
    'position',
    'impressions',
    'clicks',
    'ctr'
  ];

  pageColumns: string[] = ['name', 'position', 'impressions', 'clicks', 'ctr'];
  length = 0;
  dataSource: any;
  totalImpressions: string;
  totalClicks: string;
  avgCtr: number;
  avgPosition: number;

  pageSize = 10;
  isLoadingResults = true;
  pageSizeOptions: [5, 10, 20, 50];
  filters: IFilters;
  params = new HttpParams()
    .set('order', '')
    .set('direction', '')
    .set('skip', 0)
    .set('take', 10);
  endDate = moment().format('YYYY-MM-DD');
  startDate = moment(this.endDate).subtract(7, 'days').format('YYYY-MM-DD');

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

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
    this._destroy$ = new Subject<any>();
    this.type = this.route.snapshot.data['type'];
    this.params = this.params.set('type', this.type);
    this.sharedService.hasFilters
      .pipe(takeUntil(this._destroy$))
      .subscribe((value) => (this.hasFilters = value));
    this.sharedService.getFilters.subscribe((value: IFilters) => {
      this.filters = value;
      this.getData();
    });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.store.dispatch(showLoading());
      this.params = this.params.set('order', this.sort.active);
      this.params = this.params.set('direction', this.sort.direction);
      this.getData();
    });
    this.setTable();
  }

  getData() {
    this.store.dispatch(showLoading());
    this.httpService
      .post(`${this.type}/all/?` + this.params, {
        hasFilter: this.hasFilters,
        filters: this.filters
      })
      .pipe(tap())
      .subscribe({
        next: (res) => {
          this.length = res.length;
          if (this.type === 'pages' && res.data) {
            res.data = this.calculate(res.data);
            this.dataSource = new MatTableDataSource(res.data);
            this.store.dispatch(hideLoading());
            return;
          }
          res.data = this.calculateQueryAvg(res.data);
          this.dataSource = new MatTableDataSource(res.data);
          res.data.forEach((item: IQuery) => {
            if (item.relevant) {
              this.relevantSelect.toggle(item);
            } else if (item.relevant === false) {
              this.irrelevantSelect.toggle(item);
            } else {
              return;
            }
          });
          this.dataSource.sort = this.sort;
          if (res.result) {
            this.totalImpressions = res.result.totalImpressions;
            this.totalClicks = res.result.totalClicks;
            this.avgPosition = res.result.avgPosition;
            this.avgCtr = res.result.avgCtr;
          }
          this.store.dispatch(hideLoading());
        },
        error: (error) => {
          console.log(error);
          this.store.dispatch(hideLoading());
          this.alert.error(
            'Something went wrong while fetching data.. Please try again later.'
          );
          this.router.navigate(['/']);
        }
      });
    // this.setTable();
  }

  setTable() {
    this.sharedService.data
      .pipe(takeUntil(this._destroy$))
      .subscribe((res: any) => {
        if (res.data === undefined) {
          return;
        }
        this.length = res.length;
        if (this.type === 'pages' && res.data) {
          res.data = this.calculate(res.data);
          this.dataSource = new MatTableDataSource(res.data);
          this.store.dispatch(hideLoading());
          return;
        }
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.sort = this.sort;
        if (res.result) {
          this.totalImpressions = res.result.totalImpressions;
          this.totalClicks = res.result.totalClicks;
          this.avgPosition = res.result.avgPosition;
          this.avgCtr = res.result.avgCtr;
        }
        this.store.dispatch(hideLoading());
      });
  }

  applyFilter(event: Event): void {
    this.store.dispatch(showLoading());
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.filters.query = filterValue;
    this.hasFilters = true;
    this.getData();
    if (this.dataSource.paginator) {
      this.paginator.pageIndex = 0;
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(showLoading());
    this.relevantSelect.clear();
    this.irrelevantSelect.clear();
    const skip = event.pageIndex === 0 ? 0 : event.pageIndex * event.pageSize;
    this.pageSize = event.pageSize;
    this.params = this.params.set('skip', skip).set('take', this.pageSize);
    this.getData();
  }

  addQuery(): void {
    this.dialog.open(AddQueryComponent, {
      width: '800px',
      height: '500px'
    });
  }

  filterKeywords() {
    const dialogRef = this.dialog.open(FiltersComponent, {
      width: '550px',
      height: '550px',
      data: this.type
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.query = '';
        this.hasFilters = true;
        this.sharedService.filtersSubject.next(result);
      }
    });
  }

  isAllRelevantSelected() {
    const numSelected = this.relevantSelect.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  check(event: MatCheckboxChange, row: IQuery, type: string) {
    if (type === 'relevant') {
      if (event.checked) {
        row.relevant = true;
      } else {
        row.relevant = null;
      }
      this.updateRelevant(row);
      this.relevantSelect.toggle(row);
      if (this.irrelevantSelect.isSelected(row)) {
        this.irrelevantSelect.deselect(row);
      }
    } else {
      if (event.checked) {
        row.relevant = false;
      } else {
        row.relevant = null;
      }
      this.updateRelevant(row);
      this.irrelevantSelect.toggle(row);
      if (this.relevantSelect.isSelected(row)) {
        this.relevantSelect.deselect(row);
      }
    }
    this.table.renderRows();
  }

  updateRelevant(query: IQuery) {
    return this.queryService
      .edit(query, query.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.alert.success('Edited successfully');
        },
        error: (err) => {
          console.error(err);
          this.alert.error('Error while editing...Please try again later');
        }
      });
  }

  isAllIrrelevantSelected() {
    const numSelected = this.irrelevantSelect.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  selectAllRelevant(event: MatCheckboxChange) {
    this.irrelevantSelect.clear();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isAllRelevantSelected()
      ? this.relevantSelect.clear()
      : this.dataSource.data.forEach((row: IQuery) => {
          row.relevant = true;
          this.relevantSelect.select(row);
        });
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    event.checked
      ? this.bulkEdit(this.dataSource.data, true)
      : this.bulkEdit(this.dataSource.data, null);
  }

  selectAllIrelevand(event: MatCheckboxChange) {
    this.relevantSelect.clear();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isAllIrrelevantSelected()
      ? this.irrelevantSelect.clear()
      : this.dataSource.data.forEach((row: IQuery) => {
          row.relevant = false;
          this.irrelevantSelect.select(row);
        });
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    event.checked
      ? this.bulkEdit(this.dataSource.data, false)
      : this.bulkEdit(this.dataSource.data, null);
  }

  bulkEdit(data: IQuery[], type: boolean | null) {
    this.queryService
      .bulkEdit(data, type)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.alert.success('Edited successfully');
        },
        error: (err) => {
          console.error(err);
          this.alert.error('Error while editing...Please try again later');
        }
      });
  }

  resetFilters(input: HTMLInputElement) {
    this.sharedService.hasFilterSubject.next(false);
    this.sharedService.setFilters = {
      suchvolumen: { from: 0, to: 0 },
      position: { from: 0, to: 0 },
      impressions: { from: 0, to: 0 },
      dates: { start: this.startDate, end: this.endDate },
      relevant: null,
      queryTyp: '',
      query: ''
    };
    input.value = '';
    this.params = this.params.set('skip', 0);
    this.getData();
    this.paginator.pageIndex = 0;
    this.dataSource.paginator?.firstPage();
  }

  details(row: any) {
    this.router.navigateByUrl(`${this.type}/details/${row.id}`);
  }

  ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }

  calculate(data: IPage[]) {
    if (data[0].pages) {
      data.forEach((page) => {
        let totalClicks = 0;
        let totalImpressions = 0;
        let avgPosition = 0;
        let avgCtr = 0;
        let sumPosition = 0;
        let sumCtr = 0;
        page.pages.forEach((x) => {
          totalClicks += x.clicks;
          totalImpressions += x.impressions;
          sumPosition += x.position;
          sumCtr += x.ctr;
          avgPosition = sumPosition / page.pages.length;
          avgCtr = sumCtr / page.pages.length;
        });
        page.totalClicks = totalClicks;
        page.totalImpressions = totalImpressions;
        page.avgPosition = avgPosition;
        page.avgCtr = avgCtr;
      });
    }
    return data;
  }

  calculateQueryAvg(data: IQuery[]) {
    data.forEach((query) => {
      let totalClicks = 0;
      let totalImpressions = 0;
      let avgPosition = 0;
      let avgCtr = 0;
      let sumPosition = 0;
      let sumCtr = 0;
      query.queries.forEach((x) => {
        totalClicks += x.clicks;
        totalImpressions += x.impressions;
        sumPosition += x.position;
        sumCtr += x.ctr;
        avgPosition = sumPosition / query.queries.length;
        avgCtr = sumCtr / query.queries.length;
      });
      query.totalClicks = totalClicks;
      query.totalImpressions = totalImpressions;
      query.avgPosition = avgPosition;
      query.avgCtr = avgCtr;
    });
    return data;
  }
}
