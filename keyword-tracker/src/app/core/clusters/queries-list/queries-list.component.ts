import { HttpParams } from '@angular/common/http';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, take, takeUntil } from 'rxjs';
import { IClusters } from 'src/app/interfaces/IClusters.interface';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { IQuery } from 'src/app/interfaces/IQueries.interfaces';
import { AlertService } from 'src/app/services/alert.service';
import { ClustersService } from 'src/app/services/clusters.service';
import { QueryService } from 'src/app/services/query.service';
import { SharedService } from 'src/app/services/shared.service';
import { hideLoading, showLoading } from 'src/app/store/actions';

@Component({
  selector: 'app-queries-list',
  templateUrl: './queries-list.component.html',
  styleUrls: ['./queries-list.component.scss']
})
export class QueriesListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;

  isChecked = false;
  hasFilters = false;
  filters: IFilters;
  pageSize = 10;
  designated = '';
  pageSizeOptions: [5, 10, 20, 50];
  dataSource: MatTableDataSource<IQuery>;
  displayedColumns: string[] = [
    'query',
    'avgPosition',
    'totalImpressions',
    'totalClicks',
    'avgCtr'
  ];
  params = new HttpParams()
    .set('order', '')
    .set('direction', '')
    .set('skip', 0)
    .set('take', 10);
  clusterId: number;
  length: number;
  clusterObservable: any;
  cluster: IClusters;
  private _destroy$: Subject<any>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private clustersService: ClustersService,
    private queryService: QueryService,
    private alert: AlertService,
    private store: Store<{ showLoading: boolean }>
  ) {
    this.clusterId = this.route.snapshot.params['id'];
  }

  async ngOnInit(): Promise<void> {
    this._destroy$ = new Subject<any>();
    this.store.dispatch(showLoading());
    this.getCluster();
    this.sharedService.hasFilters
      .pipe(takeUntil(this._destroy$))
      .subscribe((value) => (this.hasFilters = value));
    this.sharedService.getFilters
      .pipe(takeUntil(this._destroy$))
      .subscribe((value: IFilters) => {
        this.filters = value;
        this.filters.clusterId = this.clusterId;
        console.log(this.filters);
        this.getQueries();
      });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.store.dispatch(showLoading());
      this.params = this.params.set('order', this.sort.active);
      this.params = this.params.set('direction', this.sort.direction);
      this.getQueries();
    });
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(showLoading());
    const skip = event.pageIndex === 0 ? 0 : event.pageIndex * event.pageSize;
    this.params = this.params.set('skip', skip).set('take', event.pageSize);
    this.getQueries();
  }

  getQueries() {
    this.queryService
      .fetchAllQueries(this.params, this.hasFilters, this.filters)
      .pipe(takeUntil(this._destroy$))
      .subscribe((res: any) => {
        console.log(res);
        if (res.data === undefined) {
          return;
        }
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.sort = this.sort;
        this.length = res.length;
        this.store.dispatch(hideLoading());
      });
  }

  getCluster() {
    this.clustersService
      .getById(this.clusterId)
      .pipe(take(1))
      .subscribe({
        next: (result: { cluster: IClusters }) => {
          this.cluster = result.cluster;
        },
        error: (err) => {
          this.alert.error(err.error.msg);
          this.router.navigateByUrl('clusters/manage');
        }
      });
  }

  details(row: any) {
    this.router.navigateByUrl(`queries/details/${row.query_id}`);
  }

  ngOnDestroy(): void {
    this.filters.clusterId = undefined;
    this._destroy$.next(null);
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }
}
