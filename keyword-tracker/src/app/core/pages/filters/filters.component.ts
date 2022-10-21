import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { KeywordService } from 'src/app/services/keyword.service';
import { showLoading } from 'src/app/store/actions';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  hasError = false;
  errMsg = 'Please type Numbers only';
  hasFilters = false;
  typ = '';
  options = ['M', 'T'];
  endDate = moment().format('YYYY-MM-DD');

  startDate = moment(this.endDate).subtract(7, 'days').format('YYYY-MM-DD');

  suchvolumen = new FormGroup({
    from: new FormControl<number | null>(null),
    to: new FormControl<number | null>(null)
  });

  position = new FormGroup({
    from: new FormControl<number | null>(null),
    to: new FormControl<number | null>(null)
  });

  impressions = new FormGroup({
    from: new FormControl<number | null>(null),
    to: new FormControl<number | null>(null)
  });

  dates = new FormGroup({
    start: new FormControl(this.startDate),
    end: new FormControl(this.endDate)
  });

  filterForm = new FormGroup({
    suchvolumen: this.suchvolumen,
    position: this.position,
    impressions: this.impressions,
    dates: this.dates,
    keywordTyp: new FormControl('')
  });

  constructor(
    private keywordService: KeywordService,
    private dialog: MatDialog,
    private store: Store<{ showLoading: boolean }>
  ) {}

  ngOnInit(): void {
    console.log(this.endDate, 'endDate');
    console.log(this.startDate, 'startDate');

    this.keywordService.hasFilters.subscribe(
      (value) => (this.hasFilters = value)
    );
    this.keywordService.getFilters.subscribe((value: IFilters) => {
      this.initFiltersForm(value);
      console.log('filters --->' + JSON.stringify(value));
    });
  }

  onSearch(form: FormGroup) {
    this.keywordService.hasFilterSubject.next(true);
    let formObj = form.value;
    formObj = this.trimValues(formObj);
    if (formObj === undefined) {
      return;
    }
    this.getFiltered(formObj);
  }

  initFiltersForm(filters: IFilters) {
    this.suchvolumen.patchValue({
      from: filters.suchvolumen.from || null,
      to: filters.suchvolumen.to
    });
    this.position.patchValue({
      from: filters.position.from || null,
      to: filters.position.to
    });
    this.impressions.patchValue({
      from: filters.impressions.from || null,
      to: filters.impressions.to
    });
    this.dates.patchValue({
      start: filters.dates.start || this.startDate,
      end: filters.dates.end || this.endDate
    });
    this.filterForm.controls['keywordTyp'].setValue(filters.keywordTyp);
  }

  trimValues(obj: any) {
    for (const key in obj) {
      if (key !== 'keywordTyp' && key !== 'dates') {
        // eslint-disable-next-line guard-for-in
        for (const val in obj[key]) {
          console.log('obj[key][val]: ' + obj[key][val]);
          if (obj[key][val] !== null && obj[key][val] !== '') {
            if (isNaN(parseInt(obj[key][val], 10))) {
              this.hasError = true;
              setTimeout(() => {
                this.hasError = false;
              }, 3000);
              return;
            }
            obj[key][val] = Number(obj[key][val]);
          } else if (obj[key][val] === '') {
            obj[key][val] = null;
          }
        }
      }
    }
    console.log('obj: ' + JSON.stringify(obj));
    return obj;
  }

  getFiltered(form: any) {
    console.log(form);
    this.store.dispatch(showLoading());
    this.keywordService.setFilters = form;
    const params = new HttpParams();
    this.keywordService.fetchAll(params, this.hasFilters, form);
    this.dialog.closeAll();
  }

  changeTyp(value: string) {
    this.typ = value;
  }
}
