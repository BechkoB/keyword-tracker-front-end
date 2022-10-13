import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { KeywordService } from 'src/app/services/keyword.service';

@Component({
  selector: 'app-add-keyword',
  templateUrl: './add-keyword.component.html',
  styleUrls: ['./add-keyword.component.scss']
})
export class AddKeywordComponent implements OnInit {
  keywordForm = new FormGroup({
    keyword: new FormControl(null, [Validators.required]),
    url: new FormControl(null, [Validators.required]),
    suchvolumen: new FormControl(null),
    typ: new FormControl(null)
  });
  filters: IFilters;

  constructor(
    private keywordService: KeywordService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.keywordService.getFilters.subscribe(
      (value: IFilters) => (this.filters = value)
    );
  }

  addKeyword(form: FormGroup): void {
    this.keywordService
      .save(form.value)
      .pipe(take(1))
      .subscribe(() => {
        console.log('Keyword added successfully');
        const params = new HttpParams()
          .set('skip', 0)
          .set('take', 10)
          .set('type', 'keywords');
        console.log(this.filters);
        this.keywordService.fetchAll(params, false, this.filters);
        this.dialog.closeAll();
      });
  }
}
