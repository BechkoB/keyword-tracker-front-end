import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { AlertService } from 'src/app/services/alert.service';
import { QueryService } from 'src/app/services/query.service';
import { SharedService } from 'src/app/services/shared.service';
import { Store } from '@ngrx/store';
import * as XLSX from 'xlsx';
import { hideLoading, showLoading } from 'src/app/store/actions';

interface ICsvUploads {
  name: string;
  esv: string | number;
  clusterId: string | number;
}

@Component({
  selector: 'app-add-query',
  templateUrl: './add-query.component.html',
  styleUrls: ['./add-query.component.scss']
})
export class AddQueryComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    page: new FormControl(null),
    esv: new FormControl(null),
    typ: new FormControl(null)
  });
  filters: IFilters;

  constructor(
    private queryService: QueryService,
    private sharedService: SharedService,
    private router: Router,
    private alert: AlertService,
    private dialog: MatDialog,
    private store: Store<{ showLoading: boolean }>
  ) {}

  ngOnInit(): void {
    this.sharedService.getFilters.subscribe(
      (value: IFilters) => (this.filters = value)
    );
  }

  add(form: FormGroup): void {
    this.dialog.closeAll();
    this.queryService
      .save(form.value)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.router.navigateByUrl('/');
          this.alert.success('Query added successfully');
        },
        error: (err: any) => {
          console.error(err);
          this.alert.error(`Error while adding query: ${err.error.msg}`);
          this.router.navigateByUrl('/');
        }
      });
  }

  onFileChange(e: any) {
    console.log('entered file upload');
    const selectedFile = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);

    fileReader.onload = (event) => {
      const binaryData = event.target?.result;
      const fileData = XLSX.read(binaryData, { type: 'binary' });
      fileData.SheetNames.forEach((sheet) => {
        const data: ICsvUploads[] = XLSX.utils.sheet_to_json(
          fileData.Sheets[sheet]
        );
        if (data) {
          this.store.dispatch(showLoading());
          this.dialog.closeAll();
          this.queryService
            .bulkAddQueries(data)
            .pipe(take(1))
            .subscribe({
              next: () => {
                this.store.dispatch(hideLoading());
                this.alert.success('Queries added successfully');
              },
              error: (err) => {
                this.store.dispatch(hideLoading());
                this.alert.error(`Error while adding query: ${err.error.msg}`);
              }
            });
        }
      });
    };
  }
}
