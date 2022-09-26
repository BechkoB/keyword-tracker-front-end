import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy
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
import { environment } from '../../../../environments/environment';
import { DatePickerComponent } from '../../pages/date-picker/date-picker.component';
import * as moment from 'moment';

@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.scss']
})
export class KeywordsComponent implements OnInit, AfterViewInit, OnDestroy {
  private _destroy$: Subject<any>;
  hasFilters = false;
  displayedColumns: string[] = [
    'key',
    'suchvolumen',
    'url',
    'typ',
    'position',
    'impressions',
    'clicks',
    'ctr'
  ];
  length = 0;
  dataSource: MatTableDataSource<any>;
  pageSize = 10;
  isLoadingResults = true;
  pageSizeOptions: [5, 10, 20, 50];
  filters: IFilters;
  params = new HttpParams().set('order', '').set('direction', '');

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private keywordService: KeywordService,
    private dialog: MatDialog,
    private store: Store<{ showLoading: boolean }>
  ) {}

  ngOnInit(): void {
    this._destroy$ = new Subject<any>();
    this.getData(0, 0);
    this.keywordService.hasFilters
      .pipe(takeUntil(this._destroy$))
      .subscribe((value) => (this.hasFilters = value));
    this.keywordService.getFilters
      .pipe(takeUntil(this._destroy$))
      .subscribe((value: IFilters) => (this.filters = value));
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.store.dispatch(showLoading());
      this.params = this.params.set('order', this.sort.active);
      this.params = this.params.set('direction', this.sort.direction);
      console.log(this.params);
      this.keywordService.fetchAll(this.params, this.hasFilters, this.filters);
    });
  }

  async getData(skip: number, take: number) {
    this.store.dispatch(showLoading());
    let params = new HttpParams();
    params = params.set('skip', skip);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    take !== 0 ? (params = params.set('take', take)) : null;
    this.keywordService.fetchAll(params, this.hasFilters, undefined);
    this.setTable();
  }

  setTable() {
    this.keywordService.keywords
      .pipe(takeUntil(this._destroy$))
      .subscribe((data: any) => {
        console.log(data, 'data');
        if (data.data) {
          data.data = this.removeUrl(data.data);
          this.length = data.length;
          this.dataSource = new MatTableDataSource(data.data);
          this.dataSource.sort = this.sort;
        } else {
          data = this.removeUrl(data);
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
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

  removeUrl(array: IKeyword[]): IKeyword[] {
    array.map((item: IKeyword) => {
      item.url = item.url.replace(environment.mainUrl, '');
    });
    return array;
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(showLoading());
    const skip = event.pageIndex === 0 ? 0 : event.pageIndex * event.pageSize;
    const take = event.pageSize;
    this.params = this.params.set('skip', skip).set('take', take);
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
        // this.keywordService.setFilters = this.filters;
        this.keywordService.fetchAll(this.params, true, this.filters);
      }
    });
  }

  resetFilters(input: HTMLInputElement) {
    this.hasFilters = false;
    this.keywordService.setFilters = {
      suchvolumen: { from: null, to: null },
      position: { from: null, to: null },
      impressions: { from: null, to: null },
      dates: { start: null, end: null },
      keywordTyp: '',
      keyword: ''
    };
    input.value = '';
    this.getData(0, 0);
  }

  ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }
}
