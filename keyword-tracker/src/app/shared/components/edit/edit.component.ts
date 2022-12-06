import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { IPage } from 'src/app/interfaces/IPages.interfaces';
import { IQuery } from 'src/app/interfaces/IQueries.interfaces';
import { QueryService } from 'src/app/services/query.service';
import { SharedService } from 'src/app/services/shared.service';
import { PageService } from 'src/app/services/page.service';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  filters: IFilters;
  type: string;
  pageForm = new FormGroup({
    name: new FormControl(),
    est_search_volume: new FormControl(),
    typ: new FormControl(),
    relevant: new FormControl()
  });

  queryForm = new FormGroup({
    designated: new FormControl(),
    est_search_volume: new FormControl(),
    typ: new FormControl(),
    relevant: new FormControl()
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private queryService: QueryService,
    private router: Router,
    private alert: AlertService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.sharedService.getFilters.subscribe(
      (value: IFilters) => (this.filters = value)
    );
    if (!this.data) {
      return;
    }
    this.type = this.data.from;
    console.log(this.type);
    this.initForm();
  }

  initForm() {
    if (this.type === 'page') {
      this.pageForm.patchValue({
        name: this.data.page.name,
        est_search_volume: this.data.est_search_volume,
        typ: this.data.page.typ,
        relevant: this.data.page.relevant === true ? 'Ja' : 'Nein'
      });
      this.pageForm.controls.name.disable();
    } else {
      this.queryForm.patchValue({
        designated: this.data.query.designated
          ? this.data.query.designated.name
          : null,
        est_search_volume: this.data.query.est_search_volume,
        typ: this.data.query.typ,
        relevant: this.data.query.relevant === true ? 'Ja' : 'Nein'
      });
    }
  }

  edit(form: FormGroup) {
    form.value.tracken =
      form.value.tracken.toLowerCase() === 'ja' ? true : false;

    if (this.type === 'page') {
      return;
      // this.urlService
      //   .editUrl(form.value, this.data.url.name)
      //   .pipe(take(1))
      //   .subscribe((res) => {
      //     console.log(res);
      //   });
    }
    form.value.designated = form.value.designated.replace(
      environment.mainUrl,
      ''
    );
    return this.queryService
      .edit(form.value, this.data.query.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          window.location.reload();
          this.alert.success('Edited successfully');
        },
        error: (err) => {
          console.error(err);
          this.alert.error('Error while editing...Please try again later');
        }
      });
  }
}
