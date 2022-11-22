import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { IPage } from 'src/app/interfaces/IPages.interfaces';
import { IQuery } from 'src/app/interfaces/IQueries.interfaces';
import { AlertService } from 'src/app/services/alert.service';
import { PageService } from 'src/app/services/page.service';
import { SharedService } from 'src/app/services/shared.service';
import { hideLoading, showLoading } from 'src/app/store/actions';
import { EditComponent } from '../../pages/edit/edit.component';

@Component({
  selector: 'app-page',
  templateUrl: './page-details.component.html',
  styleUrls: ['./page-details.component.scss']
})
export class PageDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  pageId: string;
  length: number;
  pageSize = 10;
  pageSizeOptions: [5, 10, 20, 50];
  page: IPage | undefined;
  dataSource: MatTableDataSource<IQuery>;
  filters: IFilters;

  displayedColumns: string[] = [
    'url',
    'position',
    'impressions',
    'clicks',
    'ctr'
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
    this.sharedService.getFilters.subscribe(
      (value: IFilters) => (this.filters = value)
    );
    this.pageService
      .getById(this.pageId, this.filters)
      .pipe(take(1))
      .subscribe({
        next: (result: { page: IPage; queries: IQuery[] }) => {
          this.page = result.page;
          this.length = result.queries.length;
          this.dataSource = new MatTableDataSource(result.queries);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.store.dispatch(hideLoading());
        },
        error: (err: any) => {
          console.error(err);
          this.alert.error(
            'Something went wrong while fetching data.. Please try again later.'
          );
          this.router.navigate(['/']);
        }
      });
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
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
}
