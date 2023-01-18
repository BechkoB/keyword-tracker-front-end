import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import {
  SocialLoginModule,
  SocialAuthServiceConfig
} from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/login/login.component';
import { MainComponent } from './core/main/main.component';
import { NavComponent } from './core/nav/nav.component';

import {
  DateAdapter,
  MatRippleModule,
  MatNativeDateModule
} from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';

import { LoadingSpinnerComponent } from './shared/helpers/loading-spinner/loading-spinner.component';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './store/reducers';
import { AddQueryComponent } from './shared/components/add-query/add-query.component';
import { FiltersComponent } from './shared/components/filters/filters.component';
import { DatePickerComponent } from './shared/components/date-picker/date-picker.component';

import { environment } from '../environments/environment';
import { DateAdapterComponent } from './shared/helpers/date-adapter/date-adapter.component';
import { QueryDetailsComponent } from './core/queries/components/query-details/query-details.component';

import { TransformString } from './pipes/transform-string.pipe';
import { CtrTransform } from './pipes/ctr.pipe';
import { DateComponent } from './core/date/date.component';
import { EditComponent } from './shared/components/edit/edit.component';
import { PageDetailsComponent } from './core/pages/components/page-details/page-details.component';
import { AlertComponent } from './shared/helpers/alert/alert.component';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { QueriesComponent } from './core/queries/queries.component';
import { PagesComponent } from './core/pages/pages.component';
import { NewQueriesComponent } from './core/queries/components/new-queries/new-queries.component';
import { DesignatedPageComponent } from './core/queries/components/designated-page/designated-page.component';
import { OverviewComponent as QueryOverviewComponent } from './core/queries/components/overview/overview.component';
import { OverviewComponent as PageOverviewComponent } from './core/pages/components/overview/overview.component';
import { ClustersComponent } from './core/clusters/clusters.component';
import { ManageClustersComponent } from './core/clusters/manage-clusters/manage-clusters.component';
import { EditClustersComponent } from './core/clusters/edit-clusters/edit-clusters.component';
import { CreateClustersComponent } from './core/clusters/create-clusters/create-clusters.component';
import { AssignClustersComponent } from './core/clusters/assign-clusters/assign-clusters.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    NavComponent,
    LoadingSpinnerComponent,
    AddQueryComponent,
    FiltersComponent,
    DatePickerComponent,
    QueryDetailsComponent,
    TransformString,
    CtrTransform,
    DateComponent,
    EditComponent,
    PageDetailsComponent,
    AlertComponent,
    SidebarComponent,
    QueriesComponent,
    PagesComponent,
    NewQueriesComponent,
    DesignatedPageComponent,
    QueryOverviewComponent,
    PageOverviewComponent,
    ClustersComponent,
    ManageClustersComponent,
    EditClustersComponent,
    CreateClustersComponent,
    AssignClustersComponent
  ],
  imports: [
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSidenavModule,
    MatCardModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatRadioModule,
    HttpClientModule,
    SocialLoginModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    BrowserModule,
    AppRoutingModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatRippleModule,
    MatListModule,
    MatTooltipModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatSortModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({
      showLoading: appReducer
    })
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID)
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig
    },
    { provide: DateAdapter, useClass: DateAdapterComponent },
    MainComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
