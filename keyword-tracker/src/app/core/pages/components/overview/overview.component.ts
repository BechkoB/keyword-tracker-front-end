import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { IPage } from 'src/app/interfaces/IPages.interfaces';
import { AlertService } from 'src/app/services/alert.service';
import { HttpService } from 'src/app/services/http.service';
import { QueryService } from 'src/app/services/query.service';
import { SharedService } from 'src/app/services/shared.service';
import { SelectionModel } from '@angular/cdk/collections';
import { hideLoading, showLoading } from 'src/app/store/actions';
import { FiltersComponent } from 'src/app/shared/components/filters/filters.component';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { PageService } from 'src/app/services/page.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSelect = new SelectionModel<string>(true, []);

  private _destroy$: Subject<any>;
  pageColumns: string[] = ['name', 'totalImpressions', 'totalClicks'];
  dataSource: any;
  totalImpressions: string;
  totalClicks: string;
  avgCtr: number;
  avgPosition: number;
  hasFilters = false;
  filters: IFilters;
  params = new HttpParams()
    .set('order', '')
    .set('direction', '')
    .set('skip', 0)
    .set('take', 10);
  pageSize = 10;
  length = 0;
  endDate = moment().format('YYYY-MM-DD');
  startDate = moment(this.endDate).subtract(3, 'months').format('YYYY-MM-DD');

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(
    private sharedService: SharedService,
    private pageService: PageService,
    private dialog: MatDialog,
    private router: Router,
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
    this.pageService
      .fetchAllPages(this.params, this.hasFilters, this.filters)
      .pipe(takeUntil(this._destroy$))
      .subscribe((res: any) => {
        if (res.data === undefined) {
          return;
        }
        this.length = res.length;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.sort = this.sort;
        this.store.dispatch(hideLoading());
        if (res.result) {
          this.totalImpressions = res.result.totalImpressions;
          this.totalClicks = res.result.totalClicks;
          this.avgPosition = res.result.avgPosition;
          this.avgCtr = res.result.avgCtr;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(showLoading());
    const skip = event.pageIndex === 0 ? 0 : event.pageIndex * event.pageSize;
    this.params = this.params.set('skip', skip).set('take', event.pageSize);
    this.setTable();
  }

  pageFilters() {
    const dialogRef = this.dialog.open(FiltersComponent, {
      width: '550px',
      height: '550px',
      data: 'pages'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
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

  searchPage(event: Event): void {
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
    this.router.navigateByUrl(`pages/details/${row.page_id}`);
  }

  showOrHideItem(event: any, from: string) {
    this.dataSelect.toggle(from);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    const index = this.pageColumns.indexOf(from);
    if (index !== -1) {
      this.pageColumns.splice(index, 1);
    } else {
      this.pageColumns.push(from);
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }

  // calculate(data: IPage[]) {
  //   if (data[0].pages) {
  //     data.forEach((page) => {
  //       let totalClicks = 0;
  //       let totalImpressions = 0;
  //       let avgPosition = 0;
  //       let avgCtr = 0;
  //       let sumPosition = 0;
  //       let sumCtr = 0;
  //       page.pages.forEach((x) => {
  //         totalClicks += x.clicks;
  //         totalImpressions += x.impressions;
  //         sumPosition += x.position;
  //         sumCtr += x.ctr;
  //         avgPosition = sumPosition / page.pages.length;
  //         avgCtr = sumCtr / page.pages.length;
  //       });
  //       page.totalClicks = totalClicks;
  //       page.totalImpressions = totalImpressions;
  //       page.avgPosition = avgPosition;
  //       page.avgCtr = avgCtr;
  //     });
  //   }
  //   return data;
  // }
}
