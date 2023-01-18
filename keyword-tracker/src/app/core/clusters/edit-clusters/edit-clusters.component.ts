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
import { hideLoading, showLoading } from 'src/app/store/actions';
import { SelectionModel } from '@angular/cdk/collections';
import { IQuery } from 'src/app/interfaces/IQueries.interfaces';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AlertService } from 'src/app/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ClustersService } from 'src/app/services/clusters.service';
import { AssignClustersComponent } from '../assign-clusters/assign-clusters.component';

@Component({
  selector: 'app-edit-clusters',
  templateUrl: './edit-clusters.component.html',
  styleUrls: ['./edit-clusters.component.scss']
})
export class EditClustersComponent implements OnInit, AfterViewInit, OnDestroy {
  select = new SelectionModel<IQuery>(true, []);

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private _destroy$: Subject<any>;
  hasFilters = false;
  endDate = moment().format('YYYY-MM-DD');
  startDate = moment(this.endDate).subtract(3, 'months').format('YYYY-MM-DD');
  filters = {
    query: ''
  };
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
    'totalClicks',
    'totalImpressions'
  ];
  dataSource: any;
  constructor(
    private alert: AlertService,
    private dialog: MatDialog,
    private clustersService: ClustersService,
    private router: Router,
    private store: Store<{ showLoading: boolean }>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(showLoading());
    this._destroy$ = new Subject<any>();
    this.fetchData();
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.store.dispatch(showLoading());
      this.params = this.params.set('order', this.sort.active);
      this.params = this.params.set('direction', this.sort.direction);
      this.fetchData();
    });
  }

  fetchData() {
    this.clustersService
      .getQueries(this.params, this.filters)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (result: any) => {
          this.dataSource = new MatTableDataSource(result.data);
          this.dataSource.sort = this.sort;
          this.length = result.length;
          this.store.dispatch(hideLoading());
        },
        error: (err: any) => {
          console.log(err.error.message);
          this.store.dispatch(hideLoading());
        }
      });
  }

  searchQuery(value: string): void {
    this.store.dispatch(showLoading());
    this.filters.query = value.trim().toLowerCase();
    this.fetchData();
    if (this.dataSource.paginator) {
      this.paginator.pageIndex = 0;
      this.dataSource.paginator.firstPage();
    }
  }

  details(row: any) {
    console.log(row);
    this.router.navigateByUrl(`queries/details/${row.query_id}`);
  }

  assignCluster() {
    const dialogRef = this.dialog.open(AssignClustersComponent, {
      width: '450px',
      height: '400px',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(showLoading());
        console.log(result);
        if (result.subSubCluster) {
          console.log('entered subSubCluster');
          this.addClusters(result.subSubCluster);
          return;
        } else if (result.subCluster) {
          console.log('entered subCluster');
          this.addClusters(result.subCluster);
          return;
        }
        console.log('entered final else for parent');
        this.addClusters(result.parent);
      }
    });
  }

  addClusters(cluster: any) {
    return this.clustersService
      .bulkAdd(this.select.selected, cluster)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.alert.success('Assigned successfully');
          this.fetchData();
          this.select.clear();
        },
        error: (err) => {
          console.error(err);
          this.alert.error(
            'Error while assigning cluster...Please try again later'
          );
          this.store.dispatch(hideLoading());
        }
      });
  }

  isAllSelected() {
    const numSelected = this.select.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  selectAll(event: MatCheckboxChange) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isAllSelected()
      ? this.select.clear()
      : this.dataSource.data.forEach((query: IQuery) => {
          this.select.select(query);
        });
  }

  clearSearchField(input: HTMLInputElement) {
    this.store.dispatch(showLoading());
    input.value = '';
    this.fetchData();
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(showLoading());
    const skip = event.pageIndex === 0 ? 0 : event.pageIndex * event.pageSize;
    this.params = this.params.set('skip', skip).set('take', event.pageSize);
    this.fetchData();
  }

  ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }
}
