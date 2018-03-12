import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

/** Directives **/
import { YearValidatorDirective } from './validators/year-validator';

/** services **/
import { ProfileService } from './services/profile.service';
import { ApiService } from './services/api.service';
import { AlertService } from './services/alert.service';
import { AuthGuardService } from './services/auth-guard.service';

/** components **/
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FieldErrorComponent } from './field-error/field-error.component';
import { TransactionComponent } from './transaction/transaction.component';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { InvestmentComponent } from './investment/investment.component';
import { DashboardComponent } from './dashboard/dashboard.component';

/** route config **/
const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contactUs', component: ContactUsComponent },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
  { path: 'createUser', component: CreateUserComponent, canActivate: [AuthGuardService]},
  { path: 'investment', component: InvestmentComponent/*, canActivate: [AuthGuardService]*/},
  { path: 'transaction', component: TransactionComponent/*, canActivate: [AuthGuardService]*/},
  { path: 'data-entry', component: DataEntryComponent/*, canActivate: [AuthGuardService]*/},
  { path: 'dashboard', component: DashboardComponent/*, canActivate: [AuthGuardService]*/},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    PageNotFoundComponent,
    HomeComponent,
    CreateUserComponent,
    ContactUsComponent,
    FieldErrorComponent,
    YearValidatorDirective,
    TransactionComponent,
    DataEntryComponent,
    InvestmentComponent,
    DashboardComponent
  ],
  providers: [
      ProfileService,
      ApiService,
      AlertService,
      AuthGuardService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
