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
  constructor() {}

  endDate = moment().format('YYYY-MM-DD');
  startDate = moment(this.endDate).subtract(3, 'months').format('YYYY-MM-DD');

  filters: IFilters = {
    esv: { from: 0, to: 0 },
    position: { from: 0, to: 0 },
    impressions: { from: 0, to: 0 },
    dates: { start: this.startDate, end: this.endDate },
    queryTyp: '',
    relevant: null,
    query: '',
    cluster: undefined,
    clusterId: undefined
  };

  public hasFilterSubject = new BehaviorSubject<boolean>(false);
  public filtersSubject = new BehaviorSubject<IFilters>(this.filters);

  public pageSubject = new BehaviorSubject<IPage[]>([]);
  public querySubject = new BehaviorSubject<IQuery[]>([]);

  get queryData(): Observable<IQuery[]> {
    return this.querySubject.asObservable();
  }

  get pageData(): Observable<IPage[]> {
    return this.pageSubject.asObservable();
  }

  set setFilters(value: IFilters) {
    this.filtersSubject.next(value);
  }

  get getFilters() {
    return this.filtersSubject.asObservable();
  }

  get hasFilters(): Observable<boolean> {
    return this.hasFilterSubject.asObservable();
  }
  set setHasFilters(value: boolean) {
    this.hasFilterSubject.next(value);
  }
}
