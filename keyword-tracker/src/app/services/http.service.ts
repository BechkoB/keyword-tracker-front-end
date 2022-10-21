import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = environment.rootUrl;
  }

  get(uri: string): Observable<any> {
    return this.http.get(`${this.ROOT_URL}/${uri}`, {
      headers: this.headers
    });
  }

  post(uri: string, body: object): Observable<any> {
    return this.http.post(`${this.ROOT_URL}/${uri}`, body, {
      headers: this.headers
    });
  }

  patch(uri: string, body: object): Observable<any> {
    return this.http.patch(`${this.ROOT_URL}/${uri}`, body, {
      headers: this.headers
    });
  }

  delete(uri: string) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`, {
      headers: this.headers
    });
  }

  get headers(): HttpHeaders | Record<string, never> {
    const token = JSON.parse(localStorage.getItem('token') as string);
    if (!token) {
      return {};
    }
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'x-access-token': token
    });
    return headers;
  }
}
