import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  public onSuccess(res, cb, message, callName) {
      if(res && res.success) {
          if(res.data) {
            cb(null, res.data);
            this.alert.removeAlert();
            if(message) {
                this.alert.setAlert("SUCCESS", message);
            }
            return;
          } else {
            cb(true);
            this.alert.setAlert("ERROR", "Requested Data Not present !!!");
            return;
          }
      } else if (res.reason) {
          cb(true);
          var errorMessage = "Something Went Wrong, Please try after some time.";
          if(res.reason.code) {
            if(callName == 'CreateUser' && res.reason.code === 11000)
              errorMessage = "User already present, Try different username."; 
          } else {
            errorMessage = res.reason;
          }
          this.alert.setAlert("ERROR", "ERROR - " + errorMessage);
          return;
      } else {
          cb(true);
          this.alert.setAlert("ERROR", "Something went wrong, Please try after some time.");
          return;
      }
  }

  public onError(error, cb) {
      cb(true);
      if(error.statusText === 'Unauthorized') {
          this.unAuthorizedRequest();
          return;
      }
      this.alert.setAlert("ERROR", "Something went wrong, Please try after some time.");
      return;
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
          this.onError(error, callback);
          return;
      }
    )
  };

  /* CREATE USER API */
  createUser(userData, callback) {
    this.httpClient.post('/api/json/createUser', userData, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "User Created Successfully. Sent Mail to user with username and password.", "CreateUser");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }

  /** Create investment API **/
  addInvestment(investmentData, callback) {
    this.httpClient.post('/api/json/addInvestment', investmentData, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "Investment Added Successfully !!!", "AddInvestment");
        return;
      }, (error: any) => {
        this.onError(error, callback);
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
        this.onSuccess(res, callback, "Transaction Added Successfully !!!", "AddTransaction");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }

  /** Create Product API **/
  addProduct(reqData, callback) {
    this.httpClient.post('/api/json/addProduct', reqData, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "Product Data Added Successfully !!!", "AddProduct");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }

  /** get Product Details **/
  getProductDetails(query, callback) {
    var url = (query.product === "Milk" ? "/api/json/getMilkDetails" : "/api/json/getTractorDetails");
    this.httpClient.get(url +'?limit=' + query.limit + '&start=' + query.start, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "", query.product + "Data");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }

  /** get Transaction Details **/
  getTransactionDetails(query, callback) {
    this.httpClient.get('/api/json/getTransactionDetails?limit=' + query.limit + '&start=' + query.start, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "", "GetTransactionData");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }

  /** get Investment Details **/
  getInvestmentDetails(query, callback) {
    this.httpClient.get('/api/json/getInvestmentDetails?limit=' + query.limit + '&start=' + query.start, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "", "GetInvestmentData");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }

  /** get product by ID **/
  getProductById(query, callback) {
    this.httpClient.get('/api/json/getProductById?id=' + query.id, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "", "GetProductById");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }

  /** get Transaction by ID **/
  getTransactionById(query, callback) {
    this.httpClient.get('/api/json/getTransactionById?id=' + query.id, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "", "GetTransactionById");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }

  /** get List of Admins **/
  getAdminList(callback) {
    this.httpClient.get('/api/json/getAdminList', { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "", "GetAdminList");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }

  /** delete Product by Id **/
  deleteProductById(query, callback) {
    this.httpClient.get('/api/json/deleteProductById?id=' + query.id, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "", "deleteProductById");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }

  /** delete Transaction by Id **/
  deleteTransactionById(query, callback) {
    this.httpClient.get('/api/json/deleteTransactionById?id=' + query.id, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "", "deleteTransactionById");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }

  /** Update milk data API **/
  updateMilkProductById(data, callback) {
    this.httpClient.post('/api/json/updateMilkProduct', data.updateObject, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "Milk Data Updated Successfully !!!", "UpdateMilkData");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }

  /** Update Transaction data API **/
  updateTransactionById(data, callback) {
    this.httpClient.post('/api/json/updateTransactionById', data.updateObject, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "Transaction Data Updated Successfully !!!", "UpdateTransactionData");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }
  
  /** Update Investment data API **/
  updateInvestmentById(data, callback) {
    this.httpClient.post('/api/json/updateInvestmentById', data.updateObject, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "Investment Data Updated Successfully !!!", "UpdateInvestmentData");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }

  /** Update tractor data API **/
  updateTractorDataById(data, callback) {
    this.httpClient.post('/api/json/updateTractorData', data.updateObject, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "Tractor Data Updated Successfully !!!", "UpdatetractorData");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }

  /** Upload Bill API **/
  uploadBill(file, callback) {
    let headers = new HttpHeaders();
    const formData = new FormData();
    formData.append("bill", file);

    this.httpClient.post("/api/json/uploadBill", formData, {
      headers: headers
    }).subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "Bill uploaded successfully!!!", "UploadBill");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    );
  }
  
  /** Deelte Bill Api **/
  deleteBill(filename, callback) {
    this.httpClient.get('/api/json/deleteBillImage/' + filename, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        callback(null, res);
        return;
      }, (error: any) => {
        callback(error);
        return;
      }
    )
  }

  /** create new Customer **/
  addNewCustomerData(reqData, callback) {
    this.httpClient.post('/api/json/addCustomerData', reqData, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        callback(null, res);
        return;
      }, (error: any) => {
        callback(error);
        return;
      }
    )
  }

  /** get Customer Details **/
  getCustomers(callback) {
    this.httpClient.get('/api/json/getCustomers', { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "", "GetCustomersData");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }

  /** get Customer Report **/
  getCustomerReport(query, callback) {
    this.httpClient.get('/api/json/getCustomerReport/' + query.type + '/' + query.name, { headers: { Authorization: `${this.getToken()}` }})
    .subscribe(
      (res:any) => {
        this.onSuccess(res, callback, "", query.name + "'s Customer Data");
        return;
      }, (error: any) => {
        this.onError(error, callback);
        return;
      }
    )
  }

}
