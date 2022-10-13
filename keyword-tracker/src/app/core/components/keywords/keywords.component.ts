import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Output
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IKeyword } from 'src/app/interfaces/IKeyword.interfaces';
import { KeywordService } from 'src/app/services/keyword.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpParams } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddKeywordComponent } from '../../pages/add-keyword/add-keyword.component';
import { FiltersComponent } from '../../pages/filters/filters.component';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { Store } from '@ngrx/store';
import { showLoading } from 'src/app/store/actions';
import { DatePickerComponent } from '../../pages/date-picker/date-picker.component';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.scss']
})
export class KeywordsComponent implements OnInit, AfterViewInit, OnDestroy {
  type = '';
  private _destroy$: Subject<any>;
  hasFilters = false;
  displayedColumns: string[] = [
    'key',
    'position',
    'impressions',
    'clicks',
    'ctr'
  ];
  length = 0;
  dataSource: MatTableDataSource<any>;
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

  constructor(
    private keywordService: KeywordService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<{ showLoading: boolean }>
  ) {}

  ngOnInit(): void {
    this.type = this.route.snapshot.data['type'];
    this.params = this.params.set('type', this.type);
    console.log(this.route.snapshot.data['type'], 'route data');
    this._destroy$ = new Subject<any>();
    this.keywordService.hasFilters
      .pipe(takeUntil(this._destroy$))
      .subscribe((value) => (this.hasFilters = value));
    this.keywordService.getFilters.subscribe(
      (value: IFilters) => (this.filters = value)
    );
    this.getData();
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.store.dispatch(showLoading());
      this.params = this.params.set('order', this.sort.active);
      this.params = this.params.set('direction', this.sort.direction);
      this.keywordService.fetchAll(this.params, this.hasFilters, this.filters);
    });
  }

  async getData() {
    this.store.dispatch(showLoading());
    this.keywordService.fetchAll(this.params, this.hasFilters, this.filters);
    this.setTable();
  }

  setTable() {
    this.keywordService.keywords
      .pipe(takeUntil(this._destroy$))
      .subscribe((res: any) => {
        this.length = res.length;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.sort = this.sort;
        if (res.result) {
          this.totalImpressions = res.result.totalImpressions;
          this.totalClicks = res.result.totalClicks;
          this.avgPosition = res.result.avgPosition;
          this.avgCtr = res.result.avgCtr;
        }
      });
  }

  applyFilter(event: Event): void {
    this.store.dispatch(showLoading());
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.filters.keyword = filterValue;
    this.hasFilters = true;
    this.keywordService.fetchAll(this.params, true, this.filters);

    if (this.dataSource.paginator) {
      this.paginator.pageIndex = 0;
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(showLoading());
    const skip = event.pageIndex === 0 ? 0 : event.pageIndex * event.pageSize;
    this.pageSize = event.pageSize;
    this.params = this.params.set('skip', skip).set('take', this.pageSize);
    this.keywordService.fetchAll(this.params, this.hasFilters, this.filters);
  }

  addKeyword(): void {
    this.dialog.open(AddKeywordComponent, {
      width: '800px',
      height: '500px'
    });
  }

  filterKeywords() {
    this.dialog.open(FiltersComponent, {
      width: '600px',
      height: '500px'
    });
  }

  resetFilters(input: HTMLInputElement) {
    this.hasFilters = false;
    this.keywordService.setFilters = {
      suchvolumen: { from: null, to: null },
      position: { from: null, to: null },
      impressions: { from: null, to: null },
      dates: { start: this.startDate, end: this.endDate },
      keywordTyp: '',
      keyword: ''
    };
    input.value = '';
    this.params = this.params.set('skip', 0);
    this.getData();
    this.paginator.pageIndex = 0;
    this.dataSource.paginator?.firstPage();
  }

  details(row: any) {
    console.log(row.name);
    this.router.navigateByUrl(`${this.type}/details/${row.id}/'${row.name}'`);
  }

  urlDetails(row: any) {
    console.log(row);
  }

  ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }
}
