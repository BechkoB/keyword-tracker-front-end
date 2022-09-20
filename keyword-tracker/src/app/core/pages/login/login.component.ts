import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Store } from '@ngrx/store';
import { hideLoading, showLoading } from 'src/app/store/actions';
import { UserService } from 'src/app/services/user.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  hasError = false;
  user: SocialUser;
  errMsg = 'Something went wrong!';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private userService: UserService,
    private store: Store<{ showLoading: boolean }>,
    private router: Router,
    private authService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.store.dispatch(showLoading());
      if (user === null) {
        this.store.dispatch(hideLoading());
        return;
      }
      this.user = user;
      this.userService.isUserRegistered(user.email).then((result) => {
        result.pipe(take(1)).subscribe((response) => {
          if (response.success) {
            this.userService.setUserData(response.user);
            this.router.navigateByUrl('/');
            this.store.dispatch(hideLoading());
          } else {
            this.hasError = true;
            this.errMsg = 'Something went wrong, Please try again later';
            this.router.navigateByUrl('/login');
            this.store.dispatch(hideLoading());
            return;
          }
        });
      });
    });
  }

  onLogin(form: FormGroup): void {
    const { email, password } = form.value;
    this.store.dispatch(showLoading());
    this.userService
      .login(email, password)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.store.dispatch(hideLoading());
          this.router.navigate(['/']);
        },
        error: () => {
          this.store.dispatch(hideLoading());
          this.hasError = true;
          this.errMsg = 'Email or password incorrect';
        }
      });
  }
}
