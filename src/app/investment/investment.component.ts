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
  	amountBalance: 0,
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
  public loanStatus = ['Active'];
  public adminUser = ['manoj'];
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
  public investorNameList: string[] = [];
  private investors: any[];

  ngOnInit() {
  	this.loanDetail.emiDetails.userToRemind = this.adminUser[0];
    this.api.getInvestmentDetails({limit: this.loadDataLimit}, (err, data) => {
        this.isInvestmentDetailsLoading = false;
        if(err) 
          return;
        this.investmentDetails = data;
    });
    this.api.getInvestors((err, data) => {
        if(err)
          return;
        this.investors = data;
        this.investors.forEach(investor => {
          this.investorNameList.push(investor.name);
        })
    });
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
  		this.loanDetail.emiDetails.amount = this.loanDetail.amountBalance / this.loanDetail.emiDetails.term;
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
  private isAddInvestorInProgress:boolean = false;
  private isModalActive:boolean = false;
  private isAddInvestorSuccess:boolean = false;
  private investorModalError = '';

  @ViewChild('investorDataForm')
  private investorDataForm: NgForm;

  private investorDataModel = {
    name: '',
    phone: '',
    address: ''
  }

  private newInvestorData = JSON.parse(JSON.stringify(this.investorDataModel));

  openAddInvestorModal() {
    this.isModalActive = true;
  }

  closeModal() {
    this.isAddInvestorSuccess = false;
    this.isModalActive = false;
    this.investorModalError = '';
    this.investorDataForm.reset();
    this.newInvestorData = JSON.parse(JSON.stringify(this.investorDataModel));
  }

  addInvestor() {
    this.isAddInvestorInProgress = true;

    var requestObject = {
      investorEntry: {
      }
    }
    requestObject.investorEntry = this.newInvestorData;

    this.api.addNewInvestorData(requestObject, (err, res) => {
      this.isAddInvestorInProgress = false;
      if(err) {
        this.investorModalError = "Something went wrong. Please try again !!";
        return;
      }
      if(res && res.success) {
        this.isAddInvestorSuccess = true;
        this.investorNameList.unshift(res.data.name);
        this.investors.unshift(res.data);
        this.noResultTypeAhead = false;
        this.newInvestmentData.name = res.data.name;
        this.investmentForm.form.controls.name.setErrors(null);
      } else {
        this.investorModalError = res.reason;
      }
    });
  }

}
