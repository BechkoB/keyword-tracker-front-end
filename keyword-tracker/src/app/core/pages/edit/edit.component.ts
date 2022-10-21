import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { KeywordService } from 'src/app/services/keyword.service';
import { UrlService } from 'src/app/services/url.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  type: string;
  form = new FormGroup({
    name: new FormControl(),
    suchvolumen: new FormControl(),
    typ: new FormControl(),
    tracken: new FormControl()
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private keywordService: KeywordService,
    private urlService: UrlService
  ) {}

  ngOnInit(): void {
    if (!this.data) {
      return;
    }
    this.type = this.data.from;
    console.log(this.type);
    this.initForm();
  }

  initForm() {
    console.log(this.data);
    if (this.type === 'urls') {
      this.form.patchValue({
        name: this.data.url.keyword.name,
        suchvolumen: this.data.url.suchvolumen,
        typ: this.data.url.typ,
        tracken: this.data.url.tracken === true ? 'Ja' : 'Nein'
      });
      this.form.controls.name.disable();
    } else {
      this.form.patchValue({
        name: this.data.keyword.urls[0].name.replace(environment.mainUrl, ''),
        suchvolumen: this.data.keyword.suchvolumen,
        typ: this.data.keyword.typ,
        tracken: this.data.keyword.racken === true ? 'Ja' : 'Nein'
      });
    }
  }

  edit(form: FormGroup) {
    console.log(this.type, 'type');
    console.log(form.value, 'form.value');
    console.log(this.data, 'this.data');
    form.value.tracken =
      form.value.tracken.toLowerCase() === 'ja' ? true : false;

    if (this.type === 'urls') {
      return this.urlService
        .editUrl(form.value, this.data.url.name)
        .pipe(take(1))
        .subscribe((res) => {
          console.log(res);
        });
    }
    return this.keywordService
      .editKeyword(form.value, this.data.keyword.name)
      .pipe(take(1))
      .subscribe((res) => {
        console.log(res);
      });
  }
}
