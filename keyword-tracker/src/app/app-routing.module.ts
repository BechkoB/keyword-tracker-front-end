import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeywordsComponent } from './core/components/keywords/keywords.component';
import { LoginComponent } from './core/pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'keywords', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'keywords', component: KeywordsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
