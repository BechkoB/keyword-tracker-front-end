import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { IFilters } from '../interfaces/IFilters.interface';
import { IKeyword } from '../interfaces/IKeyword.interfaces';
import { hideLoading } from '../store/actions';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class KeywordService {
  filters: IFilters = {
    suchvolumen: { from: null, to: null },
    position: { from: null, to: null },
    impressions: { from: null, to: null },
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
    this.httpService
      .post('keywords/all/?' + params, {
        hasFilter,
        filters
      })
      .subscribe((data) => {
        this.keywordSubject.next(data);
        this.store.dispatch(hideLoading());
      });
  }

  save(body: object): Observable<any> {
    return this.httpService.post('keywords/add', body);
  }

  filter(body: object): Observable<any> {
    return this.httpService.post('keywords/filter', body);
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
