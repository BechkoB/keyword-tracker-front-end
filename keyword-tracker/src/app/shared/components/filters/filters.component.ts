import { HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { IFilters } from 'src/app/interfaces/IFilters.interface';
import { SharedService } from 'src/app/services/shared.service';
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
  relevantOptions = [
    { value: true, display: 'Yes' },
    { value: false, display: 'No' },
    { value: 'null', display: 'Not defined' }
  ];
  relevant: boolean | null;
  endDate = moment().format('YYYY-MM-DD');
  formObj: any;
  startDate = moment(this.endDate).subtract(7, 'days').format('YYYY-MM-DD');

  filterForm = new FormGroup({
    esv: new FormGroup({
      from: new FormControl<number>(0),
      to: new FormControl<number>(0)
    }),
    position: new FormGroup({
      from: new FormControl<number>(0),
      to: new FormControl<number>(0)
    }),
    impressions: new FormGroup({
      from: new FormControl<number>(0),
      to: new FormControl<number>(0)
    }),
    dates: new FormGroup({
      start: new FormControl<string>(''),
      end: new FormControl<string>('')
    }),
    queryTyp: new FormControl(''),
    relevant: new FormControl<null | boolean>(null)
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private store: Store<{ showLoading: boolean }>
  ) {}

  ngOnInit(): void {
    this.sharedService.getFilters.subscribe((value: IFilters) => {
      this.initFiltersForm(value);
    });
    this.sharedService.hasFilters.subscribe(
      (value) => (this.hasFilters = value)
    );
  }

  onSearch(form: FormGroup) {
    this.sharedService.hasFilterSubject.next(true);
    this.formObj = this.trimValues(form.value);
    if (this.formObj === undefined) {
      return;
    }
    this.getFiltered(this.formObj);
  }

  initFiltersForm(filters: IFilters) {
    this.filterForm.controls.esv.patchValue({
      from: filters.esv.from,
      to: filters.esv.to
    });
    this.filterForm.controls.position.patchValue({
      from: filters.position.from,
      to: filters.position.to
    });
    this.filterForm.controls.impressions.patchValue({
      from: filters.impressions.from,
      to: filters.impressions.to
    });
    this.filterForm.controls.dates.patchValue({
      start: filters.dates.start,
      end: filters.dates.end
    });
    this.filterForm.controls.queryTyp.setValue(filters.queryTyp);
    this.filterForm.controls.relevant.setValue(filters.relevant);
  }

  trimValues(obj: any) {
    for (const key in obj) {
      if (key !== 'keywordTyp' && key !== 'dates' && key !== 'relevant') {
        // eslint-disable-next-line guard-for-in
        for (const val in obj[key]) {
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
    return obj;
  }

  getFiltered(form: any) {
    this.store.dispatch(showLoading());
    this.sharedService.setFilters = form;
    this.dialog.closeAll();
  }
}
