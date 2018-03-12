import { Component, OnInit, Input, ViewChild} from '@angular/core';

import { NgForm } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  private transactionModel = {
  	transactionType: 'Income',
  	incomeType: 'Retail Settlement',
  	expenseType: 'VendorSettlement',
  	name: '',
  	amount: 0,
  	eventOn: {
  		date: '',
  		month: '',
  		year: ''
  	},
  	remarks: ''
  };

  private newTransactionData =  Object.assign({}, this.transactionModel);

  public transactionTypes = ["Income", "Expense"];
  public incomeTypes = ["Retail Settlement", "Corpporate Settlement"];
  public expenseTypes = ["VendorSettlement", "EMI" , "FARM Expense"];

  private callInProgress: boolean = false;

  @ViewChild('transactionForm')
  private transactionForm: NgForm;

  constructor(private api: ApiService) { }

  ngOnInit() {

  }

  resetTransactionData() {
  	this.transactionForm.reset();
    setTimeout(() => {
      this.newTransactionData = Object.assign({}, this.transactionModel);
    }, 0);
  }

  addTransaction() {
    this.callInProgress = true;
  	var requestObject = {
  		transactionData: {
  		}
  	}
  	requestObject.transactionData = this.newTransactionData;

  	this.api.addTransaction(requestObject, (err, data) => {
      	this.callInProgress = false;
      	console.log(err);
      	if(err) 
          return;
  	    this.resetTransactionData();
  	});
  }

}
