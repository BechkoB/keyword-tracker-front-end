import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  constructor(private httpService: HttpService) {}

  getUrlById(id: string): Observable<any> {
    return this.httpService.get(`urls/${id}`);
  }

  editUrl(body: object, name: string): Observable<any> {
    return this.httpService.patch(`urls/edit/${name}`, body);
  }
}
