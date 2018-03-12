import { Component, OnInit, Input, ViewChild} from '@angular/core';

import { NgForm } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.css']
})
export class InvestmentComponent implements OnInit {
  private investmentModel = {
    type: 'Own Investment',
    name: 'CAPITAL INVESTMENT - SELF',
    amount: '',
    purpose: '',
    eventOn: {
    	date: '',
    	month: '',
    	year: ''
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
  	    	date: '',
  	    	month: '',
  	    	year: ''
  	    },
  		remindBefore: '',
  		userToRemind: ''
  	}
  }

  private newInvestmentData =  Object.assign({}, this.investmentModel);
  private loanDetail = Object.assign({}, this.loanModel);

  public investmentTypes = ["Own Investment", "Bank Loan", "Loan From individual"];
  public loanStatus = ['Active'];
  public adminUser = ['manoj'];
  public showLoanInfo = false;
  public otherCustomError = "";

  private callInProgress: boolean = false;

  @ViewChild('investmentForm')
  private investmentForm: NgForm;

  constructor(private api: ApiService) { }

  ngOnInit() {
  	this.loanDetail.emiDetails.userToRemind = this.adminUser[0];
  }

  typeChanged() {
  	if(this.newInvestmentData.type !== 'Own Investment') {
  		this.newInvestmentData.name = '';
  		this.showLoanInfo = true;
  	} else {
  		this.newInvestmentData.name = 'CAPITAL INVESTMENT - SELF';
  		this.showLoanInfo = false;
  	}
  }

  calcualteEMIAmount() {
  	var repayAmount = this.investmentForm.form.controls.repayAmount;
  	var terms = this.investmentForm.form.controls.terms;
  	console.log(this.investmentForm.form.controls);
  	if(repayAmount.pristine || repayAmount.errors || terms.pristine || terms.errors) {
  		return;
  	} else {
  		this.loanDetail.emiDetails.amount = this.loanDetail.amountBalance / this.loanDetail.emiDetails.term;
  	}
  }

  resetInvestmentData() {
  	this.investmentForm.reset();
    setTimeout(() => {
      this.newInvestmentData = Object.assign({}, this.investmentModel);
      this.loanDetail = Object.assign({}, this.loanModel);
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
      	console.log(err);
      	if(err) 
          return;
  	    this.resetInvestmentData();
  	});
  }

}
