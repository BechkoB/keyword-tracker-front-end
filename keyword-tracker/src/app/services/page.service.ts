import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  constructor(private httpService: HttpService) {}

  getById(id: string): Observable<any> {
    return this.httpService.get(`pages/${id}`);
  }

  edit(body: object, name: string): Observable<any> {
    return this.httpService.patch(`pages/edit/${name}`, body);
  }
}
