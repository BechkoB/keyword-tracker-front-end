import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFilters } from '../interfaces/IFilters.interface';
import { IPage } from '../interfaces/IPages.interfaces';
import { IQuery } from '../interfaces/IQueries.interfaces';
import { HttpService } from './http.service';

interface ICsvUploads {
  name: string;
  esv: string | number;
  clusterId: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  constructor(private httpService: HttpService) {}

  edit(body: object, id: number): Observable<any> {
    return this.httpService.patch(`queries/edit/${id}`, body);
  }

  bulkEdit(body: IQuery[], type: boolean | null): Observable<any> {
    return this.httpService.patch(`queries/edit/bulk`, {
      data: body,
      type
    });
  }

  updateDesignatedPage(
    id: number,
    pageId: number,
    checked: boolean
  ): Observable<any> {
    return this.httpService.patch(`queries/update/designated/${id}`, {
      pageId,
      checked
    });
  }

  bulkAssignDesignatedPage(body: any): Observable<any> {
    return this.httpService.patch('queries/update/bulk/designated/', body);
  }

  bulkAddQueries(body: ICsvUploads[]): Observable<any> {
    return this.httpService.post('queries/bulk/add', body);
  }

  save(body: object): Observable<any> {
    return this.httpService.post('queries/create', body);
  }

  getDesignatedSuggestions(
    params: HttpParams,
    filters: IFilters
  ): Observable<any> {
    return this.httpService.post('queries/designated/suggestions?' + params, {
      filters
    });
  }

  filter(body: object): Observable<any> {
    return this.httpService.post('queries/filter', body);
  }

  fetchAllQueries(
    params: HttpParams,
    hasFilter: boolean,
    filters: IFilters
  ): Observable<any> {
    return this.httpService.post('queries/all/?' + params, {
      hasFilter,
      filters
    });
  }

  getById(id: number, filters: IFilters, params: HttpParams): Observable<any> {
    return this.httpService.post(`queries/${id}?` + params, filters);
  }

  getNewQueries(params: HttpParams, filters: IFilters): Observable<any> {
    return this.httpService.post(`queries/new/queries?` + params, { filters });
  }
}
