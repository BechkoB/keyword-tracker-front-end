import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './core/components/main/main.component';
import { QueryDetailsComponent } from './core/components/query-details/query-details.component';
import { LoginComponent } from './core/pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { PageDetailsComponent } from './core/components/page-details/page-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'queries', pathMatch: 'full' },

  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: 'queries',
    component: MainComponent,
    data: { type: 'queries' },
    canActivate: [AuthGuard]
  },
  {
    path: 'pages',
    component: MainComponent,
    data: { type: 'pages' },
    canActivate: [AuthGuard]
  },
  {
    path: 'queries/details/:id',
    data: { type: 'queries' },
    component: QueryDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pages/details/:id',
    data: { type: 'pages' },
    component: PageDetailsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
