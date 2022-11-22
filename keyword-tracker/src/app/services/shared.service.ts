import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { IFilters } from '../interfaces/IFilters.interface';
import { IPage } from '../interfaces/IPages.interfaces';
import { IQuery } from '../interfaces/IQueries.interfaces';
import { hideLoading } from '../store/actions';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor(
    private httpService: HttpService,
    private router: Router,
    private store: Store<{ showLoading: boolean }>
  ) {}

  endDate = moment().format('YYYY-MM-DD');
  startDate = moment(this.endDate).subtract(3, 'months').format('YYYY-MM-DD');

  filters: IFilters = {
    suchvolumen: { from: 0, to: 0 },
    position: { from: 0, to: 0 },
    impressions: { from: 0, to: 0 },
    dates: { start: this.startDate, end: this.endDate },
    queryTyp: '',
    relevant: null,
    query: ''
  };

  public hasFilterSubject = new BehaviorSubject<boolean>(false);
  public filtersSubject = new BehaviorSubject<IFilters>(this.filters);

  public dataSubject = new BehaviorSubject<IQuery[] | IPage[]>([]);

  async fetchAll(params: HttpParams, hasFilter: boolean, filters: IFilters) {
    const route = params.get('type') === 'queries' ? 'queries' : 'pages';
    this.httpService
      .post(`${route}/all/?` + params, {
        hasFilter,
        filters
      })
      .subscribe({
        next: (response) => {
          this.dataSubject.next(response);
          this.store.dispatch(hideLoading());
        },
        error: (error) => {
          console.log(error);
          this.store.dispatch(hideLoading());
          this.router.navigate(['/']);
        }
      });
  }

  get data(): Observable<IQuery[] | IPage[]> {
    return this.dataSubject.asObservable();
  }

  public set setFilters(value: IFilters) {
    this.filtersSubject.next(value);
  }

  get getFilters() {
    return this.filtersSubject.asObservable();
  }

  get hasFilters(): Observable<boolean> {
    return this.hasFilterSubject.asObservable();
  }
}
