import { Injectable } from '@angular/core';
import { BehaviorSubject, first, map, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { IUser } from '../interfaces/IUser.interface';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Store } from '@ngrx/store';
import { hideLoading } from '../store/actions';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private authService: SocialAuthService,
    private store: Store
  ) {}

  private _loginStatus = new BehaviorSubject<boolean>(false);

  login(email: string, password: string): Observable<IUser> {
    return (
      this.httpService.post('users/login', {
        email,
        password
      }) as Observable<{ user: IUser; token: string; imgUrl: string }>
    ).pipe(
      first(),
      map((user: { user: IUser; token: string; imgUrl: string }) => {
        return this.setUserData(user);
      })
    );
  }

  setUserData(payload: { user: IUser; token: string; imgUrl: string }): IUser {
    this._loginStatus.next(true);
    const expireTime = 1555200000;
    payload.user.tokenExpiresIn = new Date().getTime() + expireTime;
    localStorage.setItem('userData', JSON.stringify(payload.user));
    localStorage.setItem('token', JSON.stringify(payload.token));
    return payload.user;
  }

  async isUserRegistered(email: string): Promise<Observable<any>> {
    const result = this.httpService.get(`users/verify/${email}`);
    return result;
  }

  autoLogin(userData: IUser) {
    if (new Date().getTime() < userData.tokenExpiresIn) {
      this._loginStatus.next(true);
      return true;
    }
    this.onLogout();
    return false;
  }

  onLogout(): void {
    localStorage.clear();
    this._loginStatus.next(false);
    this.authService.authState.subscribe((user) => {
      if (user) {
        this.authService.signOut().then(() => {
          this.store.dispatch(hideLoading());
          console.log('User logged out');
        });
      }
    });
  }

  public set userLoggedIn(state: boolean) {
    this._loginStatus.next(state);
  }

  get hasUserLoggedIn(): Observable<boolean> {
    return this._loginStatus.asObservable();
  }
}
