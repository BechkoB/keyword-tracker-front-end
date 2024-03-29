import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFilters } from '../interfaces/IFilters.interface';
import { IQuery } from '../interfaces/IQueries.interfaces';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ClustersService {
  constructor(private httpService: HttpService) {}

  fetchAll(params: HttpParams, filters: IFilters) {
    return this.httpService.post('clusters/all?' + params, {
      filters
    });
  }

  getById(id: number) {
    return this.httpService.get(`clusters/${id}`);
  }

  create(body: any) {
    return this.httpService.post('clusters/create', body);
  }

  getQueries(params: HttpParams, filters: { query: null | string }) {
    return this.httpService.post('clusters/queries?' + params, {
      filters
    });
  }

  bulkAdd(body: IQuery[], cluster: any): Observable<any> {
    return this.httpService.post('clusters/add/queries', {
      data: body,
      cluster
    });
  }
}
