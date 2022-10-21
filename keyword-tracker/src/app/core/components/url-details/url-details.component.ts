import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { IUrl } from 'src/app/interfaces/IKeyword.interfaces';
import { UrlService } from 'src/app/services/url.service';
import { EditComponent } from '../../pages/edit/edit.component';

@Component({
  selector: 'app-urls',
  templateUrl: './url-details.component.html',
  styleUrls: ['./url-details.component.scss']
})
export class UrlDetailsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  urlId: string;
  urlName: string;
  url: IUrl | undefined;
  dataSource: MatTableDataSource<IUrl>;

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
    private urlService: UrlService
  ) {
    this.urlId = this.route.snapshot.params['id'];

    console.log(this.urlName);
  }

  ngOnInit(): void {
    console.log(this.urlId);
    this.urlService
      .getUrlById(this.urlId)
      .pipe(take(1))
      .subscribe((result: IUrl[]) => {
        console.log(result);
        this.url = result[0];
        this.urlName = this.url.name;
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.sort = this.sort;
      });
  }

  edit(url: IUrl | undefined) {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '800px',
      height: '500px',
      data: {
        url,
        from: 'urls'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.url) {
          this.url.typ = result.value.typ;
          // this.url.suchvolumen = result.value.suchvolumen;
          // this.url.tracken = result.value.tracken;
        }
      }
    });
  }
}
