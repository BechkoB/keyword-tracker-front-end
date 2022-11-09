import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { IPage } from 'src/app/interfaces/IPages.interfaces';
import { IQuery } from 'src/app/interfaces/IQueries.interfaces';
import { QueryService } from 'src/app/services/query.service';
import { SharedService } from 'src/app/services/shared.service';
import { EditComponent } from '../../pages/edit/edit.component';

@Component({
  selector: 'app-query-details',
  templateUrl: './query-details.component.html',
  styleUrls: ['./query-details.component.scss']
})
export class QueryDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;

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
  queryId: string;
  query: IQuery;
  pages: IPage[];
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private queryService: QueryService,
    private sharedService: SharedService
  ) {
    this.queryId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.sharedService.getFilters.subscribe(
      (value: IFilters) => (this.filters = value)
    );
    this.queryService
      .getById(this.queryId, this.filters)
      .pipe(take(1))
      .subscribe((result: { query: IQuery; pages: IPage[] }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        if (result.query.designated) {
          this.designated = result.query.designated.name;
          result.pages.forEach((page) => {
            if (page.id === result.query.designated.id) {
              page.checked = true;
            } else {
              page.checked = false;
            }
          });
        } else {
          result.pages.forEach((page) => {
            page.checked = false;
          });
        }
        this.query = result.query;
        this.pages = result.pages;
        this.dataSource = new MatTableDataSource(this.pages);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  ngAfterViewInit(): void {}

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

  onChecked(id: number, name: string, event: any) {
    if (!event.checked) {
      this.designated = '';
      // return;
    } else {
      this.designated = name;
      this.pages.map((page) => {
        if (id === page.id) {
          page.checked = true;
        } else {
          page.checked = false;
        }
      });
    }
    this.queryService
      .updateDesignatedPage(this.query.id, id, event.checked)
      .pipe(take(1))
      .subscribe(() => {
        this.table.renderRows();
      });
  }
}
