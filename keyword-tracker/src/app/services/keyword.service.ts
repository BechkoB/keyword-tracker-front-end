import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { IFilters } from '../interfaces/IFilters.interface';
import { IKeyword } from '../interfaces/IKeyword.interfaces';
import { hideLoading } from '../store/actions';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class KeywordService {
  endDate = moment().format('YYYY-MM-DD');
  startDate = moment(this.endDate).subtract(7, 'days').format('YYYY-MM-DD');

  filters: IFilters = {
    suchvolumen: { from: null, to: null },
    position: { from: null, to: null },
    impressions: { from: null, to: null },
    dates: { start: this.startDate, end: this.endDate },
    keywordTyp: '',
    keyword: ''
  };

  public keywordSubject = new BehaviorSubject<IKeyword[]>([]);
  public hasFilterSubject = new BehaviorSubject<boolean>(false);
  public filtersSubject = new BehaviorSubject<IFilters>(this.filters);

  constructor(
    private httpService: HttpService,
    private store: Store<{ showLoading: boolean }>
  ) {}

  fetchAll(params: HttpParams, hasFilter: boolean, filters: any) {
    console.log(params);
    const route = params.get('type') === 'keywords' ? 'keywords' : 'urls';
    console.log(route, 'route');
    this.httpService
      .post(`${route}/all/?` + params, {
        hasFilter,
        filters
      })
      .subscribe((data) => {
        console.log(data, 'data in fetchAll in keyword.service');
        this.keywordSubject.next(data);
        this.store.dispatch(hideLoading());
      });
  }

  editKeyword(body: object, name: string): Observable<any> {
    return this.httpService.patch(`keywords/edit/${name}`, body);
  }

  save(body: object): Observable<any> {
    return this.httpService.post('keywords/add', body);
  }

  filter(body: object): Observable<any> {
    return this.httpService.post('keywords/filter', body);
  }

  getKeywordById(
    id: string,
    name: string | undefined,
    type: string
  ): Observable<any> {
    if (name) {
      return this.httpService.get(`${type}/${id}/${name}`);
    }
    return this.httpService.get(`${type}/${id}`);
  }

  public set setFilters(value: IFilters) {
    this.filtersSubject.next(value);
  }

  get getFilters() {
    return this.filtersSubject.asObservable();
  }

  get keywords(): Observable<IKeyword[]> {
    return this.keywordSubject.asObservable();
  }

  get hasFilters(): Observable<boolean> {
    return this.hasFilterSubject.asObservable();
  }
}
