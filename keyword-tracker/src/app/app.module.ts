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
import { LoginComponent } from './core/pages/login/login.component';
import { KeywordsComponent } from './core/components/keywords/keywords.component';
import { NavComponent } from './core/components/nav/nav.component';

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

import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './store/reducers';
import { AddKeywordComponent } from './core/pages/add-keyword/add-keyword.component';
import { FiltersComponent } from './core/pages/filters/filters.component';
import { DatePickerComponent } from './core/pages/date-picker/date-picker.component';

import { environment } from '../environments/environment';
import { DateAdapterComponent } from './shared/date-adapter/date-adapter.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    KeywordsComponent,
    NavComponent,
    LoadingSpinnerComponent,
    AddKeywordComponent,
    FiltersComponent,
    DatePickerComponent
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
    MatProgressSpinnerModule,
    BrowserModule,
    AppRoutingModule,
    MatDatepickerModule,
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
        autoLogin: true,
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
    { provide: DateAdapter, useClass: DateAdapterComponent }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
