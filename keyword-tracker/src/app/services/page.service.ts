import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFilters } from '../interfaces/IFilters.interface';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  constructor(private httpService: HttpService) {}

  getById(id: string, filters: IFilters): Observable<any> {
    return this.httpService.post(`pages/${id}`, filters);
  }

  edit(body: object, name: string): Observable<any> {
    return this.httpService.patch(`pages/edit/${name}`, body);
  }
}
