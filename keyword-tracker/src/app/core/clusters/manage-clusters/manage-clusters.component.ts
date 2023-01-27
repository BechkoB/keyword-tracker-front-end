import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Subject, take, takeUntil } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { hideLoading, showLoading } from 'src/app/store/actions';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { CreateClustersComponent } from '../create-clusters/create-clusters.component';
import { ClustersService } from 'src/app/services/clusters.service';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { IClusters } from 'src/app/interfaces/IClusters.interface';
import { Router } from '@angular/router';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-manage-clusters',
  templateUrl: './manage-clusters.component.html',
  styleUrls: ['./manage-clusters.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class ManageClustersComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  queryColumns: string[] = [
    'name',
    'subclusters',
    'parent',
    'esv',
    'queries',
    'avgPosition',
    'avgCtr',
    'totalClicks',
    'totalImpressions'
  ];
  dataSource: MatTableDataSource<IClusters>;
  clusters: IClusters[];
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
  expandedElement: IClusters | null;
  private _destroy$: Subject<any>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private alert: AlertService,
    private sharedService: SharedService,
    private router: Router,
    private clustersService: ClustersService,
    private store: Store<{ showLoading: boolean }>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(showLoading());
    this._destroy$ = new Subject<any>();
    this.sharedService.getFilters
      .pipe(takeUntil(this._destroy$))
      .subscribe((value: IFilters) => {
        this.filters = value;
        this.fetchClusters();
      });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.store.dispatch(showLoading());
      this.params = this.params.set('order', this.sort.active);
      this.params = this.params.set('direction', this.sort.direction);
      this.fetchClusters();
    });
  }

  onQueriesClicked(item: IClusters) {
    this.router.navigateByUrl(`/clusters/${item.id}/queries`);
  }

  calculate(clusters: IClusters[]) {
    clusters.map((cluster) => {
      let totalQueries = 0;
      let totalImpressions = 0;
      let totalClicks = 0;
      let tempPosition = 0;
      let tempCtr = 0;
      let tempEsv = 0;
      let countQueriesWithEsv = 0;

      if (cluster.queries.length > 0) {
        cluster.queries.forEach((query) => {
          totalQueries++;
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          query.est_search_volume !== null
            ? ((tempEsv += query.est_search_volume), countQueriesWithEsv++)
            : null;
          query.queries.forEach((queryData) => {
            totalImpressions += queryData.impressions;
            totalClicks += queryData.clicks;
            tempPosition += queryData.position;
            tempCtr += queryData.ctr;
          });
        });
      }
      if (cluster.children.length > 0) {
        cluster.children.forEach((child) => {
          if (child.queries.length > 0) {
            child.queries.forEach((query) => {
              totalQueries++;
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              query.est_search_volume !== null
                ? ((tempEsv += query.est_search_volume), countQueriesWithEsv++)
                : null;
              query.queries.forEach((queryData) => {
                totalImpressions += queryData.impressions;
                totalClicks += queryData.clicks;
                tempPosition += queryData.position;
                tempCtr += queryData.ctr;
              });
            });
          }
          if (child.children.length > 0) {
            child.children.forEach((subChild) => {
              if (subChild.queries.length > 0) {
                subChild.queries.forEach((query) => {
                  totalQueries++;
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  query.est_search_volume !== null
                    ? ((tempEsv += query.est_search_volume),
                      countQueriesWithEsv++)
                    : null;
                  query.queries.forEach((queryData) => {
                    totalImpressions += queryData.impressions;
                    totalClicks += queryData.clicks;
                    tempPosition += queryData.position;
                    tempCtr += queryData.ctr;
                  });
                });
              }
            });
          }
        });
      }

      cluster.totalImpressions = totalImpressions;
      cluster.queriesCount = totalQueries;
      cluster.totalClicks = totalClicks;
      cluster.avgPosition = tempPosition
        ? Number((tempPosition / totalQueries).toFixed(2))
        : 0;
      cluster.avgCtr = tempCtr
        ? Number((tempCtr / totalQueries).toFixed(2))
        : 0;
      cluster.esv = tempEsv ? (tempEsv / countQueriesWithEsv).toFixed(2) : '0';
    });
    return clusters;
  }

  fetchClusters() {
    this.store.dispatch(showLoading());
    this.clustersService
      .fetchAll(this.params, this.filters)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (result: IClusters[]) => {
          this.clusters = this.calculate(result);
          this.dataSource = new MatTableDataSource(this.clusters);
          this.dataSource.sort = this.sort;
          this.length = result.length;
          this.store.dispatch(hideLoading());
        },
        error: (err) => {
          console.log(err);
          this.store.dispatch(hideLoading());
        }
      });
  }

  searchClusters(value: string): void {
    this.store.dispatch(showLoading());
    this.filters.cluster = value.trim().toLowerCase();
    this.fetchClusters();
    this.paginator.firstPage();
  }

  clearSearchField(input: HTMLInputElement) {
    this.store.dispatch(showLoading());
    input.value = '';
    this.fetchClusters();
    this.paginator.firstPage();
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(showLoading());
    const skip = event.pageIndex === 0 ? 0 : event.pageIndex * event.pageSize;
    this.params = this.params.set('skip', skip).set('take', event.pageSize);
    this.fetchClusters();
  }

  createClusters() {
    const dialogRef = this.dialog.open(CreateClustersComponent, {
      width: '450px',
      height: '400px',
      data: this.clusters,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(showLoading());
        this.clustersService
          .create(result)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.store.dispatch(hideLoading());
              this.alert.success('Successfully created cluster!');
              this.fetchClusters();
              this.table.renderRows();
            },
            error: (err) => {
              console.log(err);
              this.store.dispatch(hideLoading());
              this.alert.error(
                'Error while creating cluster... Please try again later!'
              );
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }
}
