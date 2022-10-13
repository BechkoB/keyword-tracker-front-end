import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { IKeyword } from 'src/app/interfaces/IKeyword.interfaces';
import { KeywordService } from 'src/app/services/keyword.service';

@Component({
  selector: 'app-edit-keyword',
  templateUrl: './edit-keyword.component.html',
  styleUrls: ['./edit-keyword.component.scss']
})
export class EditKeywordComponent implements OnInit {
  keywordForm = new FormGroup({
    url: new FormControl(),
    suchvolumen: new FormControl(),
    typ: new FormControl(),
    tracken: new FormControl()
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IKeyword,
    private keywordService: KeywordService
  ) {}

  ngOnInit(): void {
    if (!this.data) {
      return;
    }
    this.initForm();
  }

  initForm() {
    console.log(this.data);
    this.keywordForm.patchValue({
      url: this.data.urls[0].name,
      suchvolumen: this.data.suchvolumen,
      typ: this.data.typ,
      tracken: this.data.tracken === true ? 'Ja' : 'Nein'
    });
  }

  editKeyword(form: FormGroup) {
    form.value.tracken =
      form.value.tracken.toLowerCase() === 'ja' ? true : false;
    console.log(form.value);
    this.keywordService
      .editKeyword(form.value, this.data.name)
      .pipe(take(1))
      .subscribe((res) => {
        console.log(res);
      });
  }
}
