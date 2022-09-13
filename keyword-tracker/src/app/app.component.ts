import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IUser } from './interfaces/IUser.interface';
import { UserService } from './services/user.service';
import { hideLoading, showLoading } from './store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'keyword-tracker';
  hasUser = false;
  loading$: boolean = false;
  loginStatus$: Observable<boolean>;
  userName: string;

  user: IUser;

  constructor (
    private store: Store<{ showLoading: boolean }>,
    private userService: UserService
    ) { }

  ngOnInit(): void {
    this.store.select('showLoading').subscribe(state => {
      Promise.resolve().then(() => {
        this.loading$ = state;
      })
    })
    this.user = JSON.parse(localStorage.getItem('userData') as string);
    if (this.user) {
      this.userService.userLoggedIn = true;
      this.loginStatus$ = this.userService.hasUserLoggedIn;
    }
    this.store.dispatch(hideLoading());
  }

}
