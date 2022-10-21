import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './core/components/main/main.component';
import { KeywordDetailsComponent } from './core/components/keyword-details/keyword-details.component';
import { LoginComponent } from './core/pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { UrlDetailsComponent } from './core/components/url-details/url-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'keywords', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: 'keywords',
    component: MainComponent,
    data: { type: 'keywords' },
    canActivate: [AuthGuard]
  },
  {
    path: 'urls',
    component: MainComponent,
    data: { type: `urls` },
    canActivate: [AuthGuard]
  },
  {
    path: 'keywords/details/:id/:name',
    data: { type: 'keywords' },
    component: KeywordDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'urls/details/:id/:name',
    data: { type: 'urls' },
    component: UrlDetailsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
