import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

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

import { ViewMilkAllComponent } from './data-entry/view-milk-all/view-milk-all.component';
import { ViewTractorAllComponent } from './data-entry/view-tractor-all/view-tractor-all.component';
import { ViewTractorComponent } from './data-entry/view-tractor/view-tractor.component';
import { ViewMilkComponent } from './data-entry/view-milk/view-milk.component';

import { ViewallInvestmentComponent } from './investment/viewall-investment/viewall-investment.component';
import { ViewInvestmentComponent } from './investment/view-investment/view-investment.component';

import { ViewTransactionComponent } from './transaction/view-transaction/view-transaction.component';
import { ViewallTransactionComponent } from './transaction/viewall-transaction/viewall-transaction.component';
import { ReportComponent } from './report/report.component';

/** route config **/
const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contactUs', component: ContactUsComponent },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
  { path: 'createUser', component: CreateUserComponent, canActivate: [AuthGuardService]},
  
  { path: 'investment/addInvestment', component: InvestmentComponent, canActivate: [AuthGuardService]},
  { path: 'investment/viewall', component: ViewallInvestmentComponent, canActivate: [AuthGuardService]},
  { path: 'investment/:id', component: ViewInvestmentComponent, canActivate: [AuthGuardService]},
  
  { path: 'transaction/addTransaction', component: TransactionComponent, canActivate: [AuthGuardService]},
  { path: 'transaction/viewall', component: ViewallTransactionComponent, canActivate: [AuthGuardService]},
  { path: 'transaction/:id', component: ViewTransactionComponent, canActivate: [AuthGuardService]},
  
  { path: 'product-entry', component: DataEntryComponent, canActivate: [AuthGuardService]},
  { path: 'product-entry/tractor/all', component: ViewTractorAllComponent, canActivate: [AuthGuardService]},
  { path: 'product-entry/milk/all', component: ViewMilkAllComponent, canActivate: [AuthGuardService]},
  { path: 'product-entry/tractor/:id', component: ViewTractorComponent, canActivate: [AuthGuardService]},
  { path: 'product-entry/milk/:id', component: ViewMilkComponent, canActivate: [AuthGuardService]},
  
  { path: 'report/:customerType/:customerName', component: ReportComponent, canActivate: [AuthGuardService]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    TypeaheadModule.forRoot(),
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
    DashboardComponent,
    ViewMilkAllComponent,
    ViewTractorAllComponent,
    ViewTractorComponent,
    ViewMilkComponent,
    ViewallInvestmentComponent,
    ViewInvestmentComponent,
    ViewTransactionComponent,
    ViewallTransactionComponent,
    ReportComponent
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
