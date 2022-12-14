import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree } from '@angular/router';
import { take } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  hasUser: boolean;

  constructor(private router: Router, private userService: UserService) {}

  canActivate(): boolean | UrlTree {
    this.userService.hasUserLoggedIn.pipe(take(1)).subscribe((isLoggedIn) => {
      this.hasUser = isLoggedIn;
    });
    if (this.hasUser) {
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }
}
