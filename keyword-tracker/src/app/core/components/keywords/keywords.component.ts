import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { first, of, Subject, take, takeUntil, takeWhile } from 'rxjs';
import { IKeyword } from 'src/app/interfaces/IKeyword.interfaces';
import { KeywordService } from 'src/app/services/keyword.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AddKeywordComponent } from '../../pages/add-keyword/add-keyword.component';
import { FiltersComponent } from '../../pages/filters/filters.component';
import { IFilters } from 'src/app/interfaces/IFilters.interface';


@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.scss']
})
export class KeywordsComponent implements OnInit {
  private _destroy$: Subject<any>;
  hasFilters: boolean = false;
  displayedColumns: string[] = ['key', 'suchvolumen', 'url', 'type', 'position', 'impressions', 'clicks', 'ctr'];
  length = 0;
  dataSource: MatTableDataSource<any>;
  pageSize = 10;
  isLoadingResults = true;
  pageSizeOptions: [5, 10, 20, 50];
  filters: IFilters;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private keywordsService: KeywordService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this._destroy$ = new Subject<any>();
    this.getData(0, 0);
    this.keywordsService.hasFilters.pipe(takeUntil(this._destroy$))
      .subscribe(value => this.hasFilters = value);
    this.keywordsService.getFilters.pipe(takeUntil(this._destroy$))
      .subscribe((value: IFilters) => this.filters = value);
  }

  async getData(skip: number, take: number) {
    let params = new HttpParams();
    params = params.set('skip', skip);
    take !== 0 ? params = params.set('take', take) : null;
    this.keywordsService.fetchAll(params, this.hasFilters, undefined)
    this.keywordsService.keywords.pipe(takeUntil(this._destroy$)).subscribe((data: any) => {
      console.log(data, 'data');
      this.isLoadingResults = false;
      if (data.data) {
        data.data = this.removeUrl(data.data);
        this.length = data.length;
        this.dataSource = new MatTableDataSource(data.data);
        this.dataSource.sort = this.sort;
      } else {
        data = this.removeUrl(data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      }
    })
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.filters.keyword = filterValue;
    const params = new HttpParams()
    this.hasFilters = true;
    this.keywordsService.fetchAll(params, true, this.filters);

    if (this.dataSource.paginator) {
      this.paginator.pageIndex = 0
      this.dataSource.paginator.firstPage();
    }
  }

  removeUrl(array: IKeyword[]): IKeyword[] {
    array.map((item: IKeyword) => {
      item.url = item.url.replace('https://www.hochzeitsportal24.de', '');
    })
    return array
  }

  onPageChange(event: PageEvent): void {
    this.isLoadingResults = true;
    const skip = event.pageIndex === 0 ? 0 : event.pageIndex * event.pageSize;
    const take = event.pageSize;
    const params = new HttpParams().set('skip', skip).set('take', take);
    this.keywordsService.fetchAll(params, this.hasFilters, this.filters)
  }

  addKeyword(): void {
    this.dialog.open(AddKeywordComponent, {
      width: '800px',
      height: '500px'
    });
  }

  filterKeywords() {
    this.dialog.open(FiltersComponent , {
      width: '600px',
      height: '500px'
    });
  }

  resetFilters() {
    this.hasFilters = false;
    this.keywordsService.setFilters = ({
      suchvolumen: { from: null, to: null },
      position: { from: null, to: null },
      impressions: { from: null, to: null },
      keywordTyp: '',
      keyword: ''
    });
    this.getData(0, 0);
  }

  ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }

}
