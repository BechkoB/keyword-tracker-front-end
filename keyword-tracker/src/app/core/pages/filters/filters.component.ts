import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { take } from 'rxjs';
import { KeywordService } from 'src/app/services/keyword.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  hasError = false;
  errMsg = 'Please type Numbers only';
  hasFilters: boolean = false;
  typ = '';
  options = ['M', 'T'];
  suchvolumen = new FormGroup({
    from: new FormControl(null),
    to: new FormControl(null)
  });

  position = new FormGroup({
    from: new FormControl(null),
    to: new FormControl(null)
  });

  impressions = new FormGroup({
    from: new FormControl(null),
    to: new FormControl(null)
  });

  // keywordTyp = new FormControl('');

  filterForm = new FormGroup({
    suchvolumen: this.suchvolumen,
    position: this.position,
    impressions: this.impressions
  });

  constructor(
    private keywordService: KeywordService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.keywordService.hasFilters
      .subscribe(value => this.hasFilters = value);
  }

  onSearch(form: FormGroup) {
    this.keywordService.hasFilterSubject.next(true);
    let hasInput = false;
    let formObj = form.value;
    formObj = this.trimValues(formObj);
    if (formObj === undefined) {
      return;
    }
    formObj.keywordTyp = this.typ;
    this.getFiltered(formObj);
  }


  trimValues(obj: any) {
    for (const key in obj) {
      for (const val in obj[key]) {
        if (obj[key][val] !== null && obj[key][val] !== '') {
          if (isNaN(parseInt(obj[key][val]))) {
            this.hasError = true;
            setTimeout(() => {
              this.hasError = false;
            }, 3000)
            return;
          }
          obj[key][val] = Number(obj[key][val]);
        } else if (obj[key][val] === '') {
          obj[key][val] = null
        }
      }
    }
    console.log(obj, 'returned obj')
    return obj
  }

  getFiltered(form: any) {
    this.keywordService.setFilters = form;
    const params = new HttpParams();
    this.keywordService.fetchAll(params, this.hasFilters, form)
    this.dialog.closeAll()
  }

  changeTyp(value: string) {
    this.typ = value;
  }

}
