import { Component, OnInit, Input, ViewChild} from '@angular/core';
import * as moment from 'moment';

import { NgForm } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.css']
})
export class InvestmentComponent implements OnInit {
  private moment;
  private today = moment();
  private investmentModel = {
    type: 'Own Investment',
    category: 'Diary Investment',
    name: 'CAPITAL-SELF',
    amount: '',
    purpose: '',
    eventOn: {
      date: this.today.format('DD'),
      month: this.today.format('MM'),
      year: this.today.format('YYYY')
    },
    remarks: '',
    loanDetail: {}
  };
  private loanModel = {
  	totalRepayAmount: 0,
	  loanStatus: 'Active',
  	emiDetails : {
  		term: 0,
  		amount: 0,
  		isInterestOnly: 'NO',
  		eventOn: {
        date: this.today.format('DD'),
        month: this.today.format('MM'),
        year: this.today.format('YYYY')
      },
  		remindBefore: '',
  		userToRemind: ''
  	}
  }

  private newInvestmentData =  JSON.parse(JSON.stringify(this.investmentModel));
  private loanDetail = JSON.parse(JSON.stringify(this.loanModel));

  public investmentTypes = ["Own Investment", "Bank Loan", "Loan From individual"];
  public investmentCategories = ["Farm Investment", "Diary Investment", "Tractor Investment"]
  public loanStatus = ['Active'];
  public adminUser = [];
  public showLoanInfo = false;
  public otherCustomError = "";

  private callInProgress: boolean = false;
  private isInvestmentDetailsLoading: boolean = true;
  private loadDataLimit:number = 10;

  private investmentDetails = [];

  @ViewChild('investmentForm')
  private investmentForm: NgForm;

  constructor(private api: ApiService) {
    this.moment = moment;
  }

  public noResultTypeAhead = false;
  public customerNameList: string[] = [];
  private customers: any[];

  ngOnInit() {
    this.api.getInvestmentDetails({limit: this.loadDataLimit}, (err, data) => {
        this.isInvestmentDetailsLoading = false;
        if(err) 
          return;
        this.investmentDetails = data;
    });
    this.api.getCustomers((err, data) => {
        if(err)
          return;
        this.customers = data;
        this.customers.forEach(investor => {
          this.pushUserByType(investor);
        })
    });
    this.api.getAdminList((err, data) => {
      if(err)
        return;
      data.forEach(admin => {
          this.adminUser.push(admin.username);
      })
      this.loanDetail.emiDetails.userToRemind = this.adminUser[0];
    });
  }

  pushUserByType(customer) {
    if(customer.type === 'Investor') {
      this.customerNameList.unshift(customer.name);
    }
  }

  typeaheadNoResults(event: boolean): void {
    this.noResultTypeAhead = event;
    this.investmentForm.form.controls.name.setErrors({'nomatch': true});
  }

  onSelectTypeAhead(event): void {
    this.investmentForm.form.controls.name.setErrors(null);
  }

  typeChanged() {
  	if(this.newInvestmentData.type !== 'Own Investment') {
  		this.newInvestmentData.name = '';
  		this.showLoanInfo = true;
  	} else {
  		this.newInvestmentData.name = 'CAPITAL-SELF';
      this.investmentForm.form.controls.name.setErrors(null);
  		this.showLoanInfo = false;
  	}
  }

  calcualteEMIAmount() {
  	var repayAmount = this.investmentForm.form.controls.repayAmount;
  	var terms = this.investmentForm.form.controls.terms;
  	if(repayAmount.pristine || repayAmount.errors || terms.pristine || terms.errors) {
  		return;
  	} else {
  		this.loanDetail.emiDetails.amount = this.loanDetail.totalRepayAmount / this.loanDetail.emiDetails.term;
  	}
  }

  resetInvestmentData() {
  	this.investmentForm.reset();
    setTimeout(() => {
      this.newInvestmentData = JSON.parse(JSON.stringify(this.investmentModel));
      this.loanDetail = JSON.parse(JSON.stringify(this.loanModel));
      this.showLoanInfo = false;
    }, 0);
  }

  addInvestment() {
    this.callInProgress = true;
  	var requestObject = {
  		investmentData: {
  			loanDetail: {
  			}
  		}
  	}
  	requestObject.investmentData = this.newInvestmentData;
  	if (this.newInvestmentData.type !== 'Own Investment') {
  		requestObject.investmentData.loanDetail = this.loanDetail;
  	}

  	this.api.addInvestment(requestObject, (err, data) => {
      	this.callInProgress = false;
      	if(err)
          return;
  	    this.resetInvestmentData();
        this.investmentDetails.unshift(data);
        if(this.investmentDetails.length > this.loadDataLimit) {
          this.investmentDetails.pop();
        }
  	});
  }

  /** Add custome modal **/
  private isAddCustomerInProgress:boolean = false;
  private isModalActive:boolean = false;
  private isAddCustomerSuccess:boolean = false;
  private customerModalError = '';
  private userTypes = ['Customer', 'Investor', 'Driver', 'Vendor', 'Employee'];
  private countryCodes: any[] = ['1','91'];

  @ViewChild('customerDataForm')
  private customerDataForm: NgForm;

  private customerDataModel = {
    name: '',
    userType: 'Customer',
    countryCode: '91',
    phone: '',
    address: '',
    pricePerLitre: 0,
    costPerUnit: 0,
    costPerRoll: 0
  }

  private newCustomerData = JSON.parse(JSON.stringify(this.customerDataModel));

  openAddCustomerModal() {
    this.isModalActive = true;
  }

  closeModal() {
    this.isAddCustomerSuccess = false;
    this.isModalActive = false;
    this.customerModalError = '';
    this.customerDataForm.reset();
    this.newCustomerData = JSON.parse(JSON.stringify(this.customerDataModel));
  }

  addCustomer() {
    this.isAddCustomerInProgress = true;

    var requestObject = {
      customerEntry: {
      }
    }
    requestObject.customerEntry = this.newCustomerData;

    this.api.addNewCustomerData(requestObject, (err, res) => {
      this.isAddCustomerInProgress = false;
      if(err) {
        this.customerModalError = "Something went wrong. Please try again !!";
        return;
      }
      if(res && res.reason && res.reason.code && res.reason.code === 11000) {
        this.customerModalError = this.newCustomerData.userType + " already present, Go back and search or try different name."; 
      } else if(res && res.success) {
        this.isAddCustomerSuccess = true;
        this.customerModalError = '';
        this.pushUserByType(res.data);
        this.customers.unshift(res.data);
      } else {
        this.customerModalError = res.reason;
      }
    });
  }
}
