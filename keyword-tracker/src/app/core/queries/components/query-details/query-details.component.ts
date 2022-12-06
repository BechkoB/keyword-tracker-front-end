import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, of, Subject, take, takeUntil } from 'rxjs';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { IPage } from 'src/app/interfaces/IPages.interfaces';
import { IQuery } from 'src/app/interfaces/IQueries.interfaces';
import { AlertService } from 'src/app/services/alert.service';
import { QueryService } from 'src/app/services/query.service';
import { SharedService } from 'src/app/services/shared.service';
import { hideLoading, showLoading } from 'src/app/store/actions';
import { EditComponent } from 'src/app/shared/components/edit/edit.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-query-details',
  templateUrl: './query-details.component.html',
  styleUrls: ['./query-details.component.scss']
})
export class QueryDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;

  designatedSelect = new SelectionModel<number>(true, []);

  isChecked = false;
  filters: IFilters;
  pageSize = 10;
  designated = '';
  pageSizeOptions: [5, 10, 20, 50];
  dataSource: MatTableDataSource<IPage>;
  displayedColumns: string[] = [
    'url',
    'position',
    'impressions',
    'clicks',
    'ctr',
    'designated'
  ];

  params = new HttpParams()
    .set('order', '')
    .set('direction', '')
    .set('skip', 0)
    .set('take', 10);
  queryId: number;
  length: number;
  query: IQuery;
  pages: IPage[];
  private _destroy$: Subject<any>;
  hasFilters = false;
  endDate = moment().format('YYYY-MM-DD');
  startDate = moment(this.endDate).subtract(3, 'months').format('YYYY-MM-DD');

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private alert: AlertService,
    private queryService: QueryService,
    private sharedService: SharedService,
    private store: Store<{ showLoading: boolean }>
  ) {
    this.queryId = this.route.snapshot.params['id'];
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
    this.getQuery();
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.store.dispatch(showLoading());
      this.params = this.params.set('order', this.sort.active);
      this.params = this.params.set('direction', this.sort.direction);
      this.getQuery();
    });
  }

  getQuery(): void {
    this.queryService
      .getById(this.queryId, this.filters, this.params)
      .pipe(
        map(
          (el: { query: IQuery; pages: { data: IPage[]; length: number } }) => {
            if (el.query.designated) {
              this.designatedSelect.toggle(el.query.designated.id);
              this.designated = el.query.designated.name;
            }
            return el;
          }
        )
      )
      .subscribe({
        next: (result) => {
          this.query = result.query;
          this.dataSource = new MatTableDataSource(result.pages.data);
          this.length = result.pages.length;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.store.dispatch(hideLoading());
        },
        error: (err) => {
          console.error(err);
          this.alert.error(
            `Something went wrong while fetching data for query whit id: ${this.queryId}`
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
    this.getQuery();
  }

  edit(query: IQuery | undefined) {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '800px',
      height: '500px',
      data: {
        query,
        from: 'query'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.query) {
          // this.keyword.typ = result.value.typ;
          // this.keyword.suchvolumen = result.value.suchvolumen;
          // this.keyword.tracken = result.value.tracken;
        }
      }
    });
  }

  onChecked(event: MatCheckboxChange, item: any) {
    this.store.dispatch(showLoading());
    if (!event.checked) {
      this.designatedSelect.deselect(item.page_id);
      this.designated = '';
      // return;
    } else {
      this.designatedSelect.clear();
      this.designatedSelect.toggle(item.page_id);
      this.designated = item.page_name;
    }
    this.queryService
      .updateDesignatedPage(this.query.id, item.page_id, event.checked)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.table.renderRows();
          this.alert.success('Query edited successfully.');
          this.store.dispatch(hideLoading());
        },
        error: (err) => {
          console.error(err);
          this.alert.error(
            'Error while choosing designated page... Please try again later.'
          );
          this.store.dispatch(hideLoading());
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(showLoading());
    const skip = event.pageIndex === 0 ? 0 : event.pageIndex * event.pageSize;
    this.params = this.params.set('skip', skip).set('take', event.pageSize);
    this.getQuery();
  }

  calculate(data: IPage[]) {
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
    return data;
  }

  details(row: any) {
    this.router.navigateByUrl(`pages/details/${row.page_id}`);
  }
}
