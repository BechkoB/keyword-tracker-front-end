import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './core/main/main.component';
import { QueryDetailsComponent } from './core/queries/components/query-details/query-details.component';
import { LoginComponent } from './core/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { PageDetailsComponent } from './core/pages/components/page-details/page-details.component';
import { QueriesComponent } from './core/queries/queries.component';
import { PagesComponent } from './core/pages/pages.component';
import { OverviewComponent as QueriesOverviewComponent } from './core/queries/components/overview/overview.component';
import { OverviewComponent as PagesOverviewComponent } from './core/pages/components/overview/overview.component';

import { NewQueriesComponent } from './core/queries/components/new-queries/new-queries.component';
import { DesignatedPageComponent } from './core/queries/components/designated-page/designated-page.component';
import { ClustersComponent } from './core/clusters/clusters.component';
import { ManageClustersComponent } from './core/clusters/manage-clusters/manage-clusters.component';
import { EditClustersComponent } from './core/clusters/edit-clusters/edit-clusters.component';

const routes: Routes = [
  { path: '', redirectTo: '/queries/overview', pathMatch: 'full' },

  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'clusters',
        component: ClustersComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'manage',
            component: ManageClustersComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'edit',
            component: EditClustersComponent,
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'queries',
        data: { type: 'queries' },
        component: QueriesComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'overview',
            component: QueriesOverviewComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'new-queries',
            component: NewQueriesComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'designated-page',
            component: DesignatedPageComponent,
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'pages',
        component: PagesComponent,
        data: { type: 'pages' },
        canActivate: [AuthGuard],
        children: [
          {
            path: 'overview',
            component: PagesOverviewComponent,
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'queries/details/:id',
        component: QueryDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'pages/details/:id',
        component: PageDetailsComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
