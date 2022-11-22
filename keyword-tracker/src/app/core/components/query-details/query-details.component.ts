import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, of, take } from 'rxjs';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { IPage } from 'src/app/interfaces/IPages.interfaces';
import { IQuery } from 'src/app/interfaces/IQueries.interfaces';
import { AlertService } from 'src/app/services/alert.service';
import { QueryService } from 'src/app/services/query.service';
import { SharedService } from 'src/app/services/shared.service';
import { hideLoading, showLoading } from 'src/app/store/actions';
import { EditComponent } from '../../pages/edit/edit.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-query-details',
  templateUrl: './query-details.component.html',
  styleUrls: ['./query-details.component.scss']
})
export class QueryDetailsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;

  designatedSelect = new SelectionModel<IPage | undefined>(true, []);

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
  queryId: number;
  query: IQuery;
  pages: IPage[];
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
    this.sharedService.getFilters.subscribe(
      (value: IFilters) => (this.filters = value)
    );
    this.getQuery(this.queryId, this.filters);
  }

  getQuery(id: number, filters: IFilters): void {
    this.queryService
      .getById(id, filters)
      .pipe(
        map((el: { query: IQuery; pages: IPage[] }) => {
          if (el.query.designated) {
            const page = el.pages.find(
              (item) => item.id === el.query.designated.id
            );
            this.designatedSelect.toggle(page);
            this.designated = el.query.designated.name;
          }
          return el;
        })
      )
      .subscribe({
        next: (result) => {
          this.query = result.query;
          this.dataSource = new MatTableDataSource(
            this.calculate(result.pages)
          );
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

  onChecked(event: MatCheckboxChange, item: IPage) {
    if (!event.checked) {
      this.designatedSelect.deselect(item);
      this.designated = '';
      // return;
    } else {
      this.designatedSelect.clear();
      this.designatedSelect.toggle(item);
    }
    this.queryService
      .updateDesignatedPage(this.query.id, item.id, event.checked)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.table.renderRows();
          this.alert.success('Query edited successfully.');
        },
        error: (err) => {
          console.error(err);
          this.alert.error(
            'Error while choosing designated page... Please try again later.'
          );
        }
      });
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
}
