import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { IPage } from 'src/app/interfaces/IPages.interfaces';
import { IQuery } from 'src/app/interfaces/IQueries.interfaces';
import { QueryService } from 'src/app/services/query.service';
import { SharedService } from 'src/app/services/shared.service';
import { PageService } from 'src/app/services/page.service';
import { environment } from 'src/environments/environment';

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
    suchvolumen: new FormControl(),
    typ: new FormControl(),
    tracken: new FormControl()
  });

  queryForm = new FormGroup({
    designated: new FormControl(),
    suchvolumen: new FormControl(),
    typ: new FormControl(),
    tracken: new FormControl()
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private queryService: QueryService,
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
    this.initForm();
  }

  initForm() {
    if (this.type === 'page') {
      this.pageForm.patchValue({
        name: this.data.page.name,
        suchvolumen: this.data.page.suchvolumen,
        typ: this.data.page.typ,
        tracken: this.data.page.tracken === true ? 'Ja' : 'Nein'
      });
      this.pageForm.controls.name.disable();
    } else {
      this.queryForm.patchValue({
        designated: this.data.query.designated
          ? this.data.query.designated.name
          : null,
        suchvolumen: this.data.query.est_search_volume,
        typ: this.data.query.typ,
        tracken: this.data.query.tracken === true ? 'Ja' : 'Nein'
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
    form.value.designated = form.value.designated.replave(
      environment.mainUrl,
      ''
    );
    return this.queryService
      .edit(form.value, this.data.query.id)
      .pipe(take(1))
      .subscribe((res) => {
        window.location.reload();
      });
  }
}
