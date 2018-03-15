import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AlertService } from './alert.service';
import { ProfileService } from './profile.service';

@Injectable()
export class ApiService {

  constructor(private httpClient: HttpClient, private alert: AlertService, private profile: ProfileService) {}

  private getToken(): string {
    return localStorage.getItem('yljwt');
  };

  public unAuthorizedRequest() {
    this.profile.logout();
    this.alert.setAlert("ERROR", "Error - Unauthorized request, Please login and proceed.");
  }

  /* SIGN IN API */
  signin(credential, callback) {
    this.httpClient.post('/api/json/signin', credential)
    .subscribe(
      (res:any) => {
        if(res && res.success && res.data && res.data.token) {
          this.profile.onSignIn(res.data);
          this.alert.removeAlert();
          callback();
          return;
        } else {
          this.alert.setAlert("ERROR", "ERROR - " + res.reason);
          callback();
          return;
        }
      }, (error: any) => {
        this.alert.setAlert("ERROR", "Something went wrong, Please try after some time.");
        callback();
        return;
      }
    )
  };

  /* CREATE USER API */
  createUser(userData, callback) {
    this.httpClient.post('/api/json/createUser', userData, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        if(res && res.success) {
          callback(null, res.data);
          this.alert.removeAlert();
          this.alert.setAlert("SUCCESS", "User Created Successfully. Sent Mail to user with username and password.");
          return;
        } else if (res.reason) {
          callback(true);
          var errorMessage = "Something Went Wrong, Please try after some time.";
          if(res.reason.code) {
            if(res.reason.code === 11000)
              errorMessage = "User already present, try different username."; 
          } else {
            errorMessage = res.reason;
          }
          this.alert.setAlert("ERROR", "ERROR - " + errorMessage);
          return;
        } else {
          callback(true);
          this.alert.setAlert("ERROR", "Something went wrong, Please try after some time.");
        }
      }, (error: any) => {
        callback(true);
        if(error.statusText === 'Unauthorized') {
          this.unAuthorizedRequest();
          return;
        }
        this.alert.setAlert("ERROR", "Something went wrong, Please try after some time.");
        return;
      }
    )
  }

  /** Create investment API **/
  addInvestment(investmentData, callback) {
    this.httpClient.post('/api/json/addInvestment', investmentData, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        if(res && res.success) {
          callback(null, res.data);
          this.alert.removeAlert();
          this.alert.setAlert("SUCCESS", "Investment Added Successfully !!!");
          return;
        } else {
          this.alert.setAlert("ERROR", "ERROR - " + res.reason);
          callback(true);
          return;
        }
      }, (error: any) => {
        this.alert.setAlert("ERROR", "Something went wrong, Please try after some time.");
        callback(true);
        return;
      }
    )
  }

  /** Create Transaction API **/
  addTransaction(reqData, callback) {
    var apiUrl = reqData.transactionData.transactionType === "Income" ? '/api/json/addIncome' : '/api/json/addExpense';
    this.httpClient.post(apiUrl, reqData, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        if(res && res.success) {
          callback(null, res.data);
          this.alert.removeAlert();
          this.alert.setAlert("SUCCESS", "Transaction Added Successfully !!!");
          return;
        } else {
          this.alert.setAlert("ERROR", "ERROR - " + res.reason);
          callback(true);
          return;
        }
      }, (error: any) => {
        this.alert.setAlert("ERROR", "Something went wrong, Please try after some time.");
        callback(true);
        return;
      }
    )
  }

  /** Create Product API **/
  addProduct(reqData, callback) {
    this.httpClient.post('/api/json/addProduct', reqData, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        if(res && res.success) {
          callback(null, res.data);
          this.alert.removeAlert();
          this.alert.setAlert("SUCCESS", "Product Data Added Successfully !!!");
          return;
        } else {
          this.alert.setAlert("ERROR", "ERROR - " + res.reason);
          callback(true);
          return;
        }
      }, (error: any) => {
        this.alert.setAlert("ERROR", "Something went wrong, Please try after some time.");
        callback(true);
        return;
      }
    )
  }


}
