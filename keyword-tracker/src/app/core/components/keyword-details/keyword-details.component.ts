import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { IKeyword } from 'src/app/interfaces/IKeyword.interfaces';
import { KeywordService } from 'src/app/services/keyword.service';
import { EditComponent } from '../../pages/edit/edit.component';

@Component({
  selector: 'app-keyword-details',
  templateUrl: './keyword-details.component.html',
  styleUrls: ['./keyword-details.component.scss']
})
export class KeywordDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  filters: IFilters;
  dataSource: MatTableDataSource<IKeyword>;
  displayedColumns: string[] = [
    'url',
    'position',
    'impressions',
    'clicks',
    'ctr'
  ];
  keywordId: string;
  keywordName: string;
  keyword: IKeyword | undefined;
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private keywordService: KeywordService
  ) {
    this.keywordId = this.route.snapshot.params['id'];
    this.keywordName = this.route.snapshot.params['name'];
  }

  ngOnInit(): void {
    this.keywordService.getFilters.subscribe(
      (value: IFilters) => (this.filters = value)
    );
    this.keywordService
      .getKeywordById(this.keywordId, this.keywordName, this.filters)
      .pipe(take(1))
      .subscribe((result: IKeyword[]) => {
        console.log(result);
        this.keyword = result[0];
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.sort = this.sort;
      });
  }

  ngAfterViewInit(): void {}

  edit(keyword: IKeyword | undefined) {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '800px',
      height: '500px',
      data: {
        keyword,
        from: 'keywords'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.keyword) {
          this.keyword.typ = result.value.typ;
          this.keyword.suchvolumen = result.value.suchvolumen;
          this.keyword.tracken = result.value.tracken;
        }
      }
    });
  }
}
