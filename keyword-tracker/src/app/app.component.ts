import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IUser } from './interfaces/IUser.interface';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Conten Audit Tool';
  hasUser = false;
  loading = false;
  loginStatus$: Observable<boolean>;
  userName: string;

  user: IUser;

  constructor(
    private store: Store<{ showLoading: boolean }>,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.store.select('showLoading').subscribe((state) => {
      Promise.resolve().then(() => {
        this.loading = state;
      });
    });
    this.user = JSON.parse(localStorage.getItem('userData') as string);
    if (this.user) {
      this.userService.autoLogin(this.user);
      this.loginStatus$ = this.userService.hasUserLoggedIn;
      return;
    }
    this.userService.onLogout();
    this.loginStatus$ = this.userService.hasUserLoggedIn;
  }
}
