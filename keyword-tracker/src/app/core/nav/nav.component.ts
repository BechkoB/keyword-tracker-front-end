import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IGoogleUser } from 'src/app/interfaces/IGoogleUser.interface';
import { IUser } from 'src/app/interfaces/IUser.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}

  user: { email: string; token: string; imgUrl: string; id: string };

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userData') as string);
  }

  onLogout() {
    this.userService.onLogout();
    this.router.navigateByUrl('login');
  }
}
