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
    private dialog: MatDialog
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
        next: () => {
          const params = new HttpParams()
            .set('skip', 0)
            .set('take', 10)
            .set('type', 'queries');
          this.sharedService.fetchAll(params, false, this.filters);
          this.alert.success('Query added successfully');
        },
        error: (err: any) => {
          console.error(err);
          this.alert.error(`Error while adding query: ${err.message}`);
        }
      });
  }
}
