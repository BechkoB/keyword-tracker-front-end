import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  hasUser: boolean;
  constructor(private router: Router, private userService: UserService) {}

  canActivate(): boolean | UrlTree {
    console.log('entered canActive AuthGuard');
    const user = JSON.parse(localStorage.getItem('userData') as string);
    if (user) {
      return this.userService.autoLogin(user);
    }
    this.router.navigateByUrl('/login');
    return false;
  }
}
