import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFilters } from '../interfaces/IFilters.interface';
import { IPage } from '../interfaces/IPages.interfaces';
import { IQuery } from '../interfaces/IQueries.interfaces';
import { HttpService } from './http.service';

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

  save(body: object): Observable<any> {
    return this.httpService.post('queries/add', body);
  }

  filter(body: object): Observable<any> {
    return this.httpService.post('queries/filter', body);
  }

  getById(id: number, filters: IFilters): Observable<any> {
    return this.httpService.post(`queries/${id}`, filters);
  }
}
