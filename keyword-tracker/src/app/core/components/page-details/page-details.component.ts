import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { IPage } from 'src/app/interfaces/IPages.interfaces';
import { IQuery } from 'src/app/interfaces/IQueries.interfaces';
import { PageService } from 'src/app/services/page.service';
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
    private pageService: PageService
  ) {
    this.pageId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.pageService
      .getById(this.pageId)
      .pipe(take(1))
      .subscribe((result: { page: IPage; queries: IQuery[] }) => {
        this.page = result.page;
        this.length = result.queries.length;
        this.dataSource = new MatTableDataSource(result.queries);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
