import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, take, takeUntil } from 'rxjs';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { IPage } from 'src/app/interfaces/IPages.interfaces';
import { IQuery } from 'src/app/interfaces/IQueries.interfaces';
import { AlertService } from 'src/app/services/alert.service';
import { PageService } from 'src/app/services/page.service';
import { SharedService } from 'src/app/services/shared.service';
import { hideLoading, showLoading } from 'src/app/store/actions';
import { EditComponent } from 'src/app/shared/components/edit/edit.component';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-page',
  templateUrl: './page-details.component.html',
  styleUrls: ['./page-details.component.scss']
})
export class PageDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  params = new HttpParams()
    .set('order', '')
    .set('direction', '')
    .set('skip', 0)
    .set('take', 10);

  pageId: string;
  length: number;
  pageSize = 10;
  pageSizeOptions: [5, 10, 20, 50];
  page: IPage | undefined;
  dataSource: MatTableDataSource<IQuery>;
  filters: IFilters;
  private _destroy$: Subject<any>;
  hasFilters = false;
  endDate = moment().format('YYYY-MM-DD');
  startDate = moment(this.endDate).subtract(3, 'months').format('YYYY-MM-DD');
  displayedColumns: string[] = [
    'url',
    'avgPosition',
    'totalImpressions',
    'totalClicks',
    'avgCtr'
  ];
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private alert: AlertService,
    private router: Router,
    private store: Store<{ showLoading: boolean }>,
    private sharedService: SharedService,
    private pageService: PageService
  ) {
    this.pageId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.store.dispatch(showLoading());
    this._destroy$ = new Subject<any>();
    this.sharedService.hasFilters
      .pipe(takeUntil(this._destroy$))
      .subscribe((value) => (this.hasFilters = value));
    this.sharedService.getFilters
      .pipe(takeUntil(this._destroy$))
      .subscribe((value: IFilters) => (this.filters = value));
    this.getPage();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
      this.store.dispatch(showLoading());
      this.params = this.params.set('order', this.sort.active);
      this.params = this.params.set('direction', this.sort.direction);
      this.getPage();
    });
  }

  getPage() {
    this.pageService
      .getById(this.pageId, this.filters, this.params)
      .pipe(take(1))
      .subscribe({
        next: (result: {
          page: IPage;
          queries: { data: IQuery[]; length: number };
        }) => {
          this.page = result.page;
          this.length = result.queries.length;
          this.dataSource = new MatTableDataSource(result.queries.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.store.dispatch(hideLoading());
        },
        error: (err: any) => {
          console.error(err);
          this.store.dispatch(hideLoading());
          this.alert.error(
            'Something went wrong while fetching data.. Please try again later.'
          );
          this.router.navigate(['/']);
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
    this.getPage();
  }

  edit(page: IPage | undefined) {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '800px',
      height: '500px',
      data: {
        page,
        from: 'page'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // if (this.url) {
        // this.url.typ = result.value.typ;
        // this.url.suchvolumen = result.value.suchvolumen;
        // this.url.tracken = result.value.tracken;
        // }
      }
    });
  }

  details(row: any) {
    this.router.navigateByUrl(`queries/details/${row.query_id}`);
  }
}
