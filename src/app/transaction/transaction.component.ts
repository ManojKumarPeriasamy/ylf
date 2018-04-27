import { Component, OnInit, Input, ViewChild} from '@angular/core';
import * as moment from 'moment';

import { NgForm } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  private moment;
  private today = moment();

  private transactionTypes = ["Income", "Expense"];
  private incomeCategories = [
      {name: 'Dairy Income', types: ["Retail Settlement", "Corpporate Settlement"]},
      {name: 'Tractor Income', types: ['Client Settlement']},
      {name: 'Farm Income', types: ['Farm Product Sales']}
    ];
  private expenseCategories = [
      {name: 'Dairy Expense', types: ['Salary', 'Medical', 'BOE', 'Local Conveyance', 'Transport Fare', 'Others']},
      {name: 'Tractor Expense', types: ['Maintenance', 'Driver expense', 'Others']},
      {name: 'Farm Expense', types: ['Seeds Purchase', 'Lease settlement', 'Pesticides', 'Other Farm Expense']}
    ];
  private selectedIncomeCategory = this.incomeCategories[0];
  private selectedExpenseCategory = this.expenseCategories[0];

  private transactionModel = {
  	transactionType: 'Income',
    incomeCategory: this.selectedIncomeCategory.name,
    expenseCategory: this.selectedExpenseCategory.name,
  	incomeType: this.selectedIncomeCategory.types[0],
  	expenseType: this.selectedExpenseCategory.types[0],
  	name: '',
  	amount: 0,
    totalExpense: 0,
  	eventOn: {
      date: this.today.format('DD'),
      month: this.today.format('MM'),
      year: this.today.format('YYYY')
    },
    billNo: '',
    billAttachment: [],
  	remarks: ''
  };

  private newTransactionData =  JSON.parse(JSON.stringify(this.transactionModel));

  private callInProgress: boolean = false;
  private isTransactionDetailsLoading: boolean = true;
  private loadDataLimit:number = 10;

  private transactionDetails = [];

  @ViewChild('transactionForm')
  private transactionForm: NgForm;

  constructor(private api: ApiService) {
    this.moment = moment;
  }

  public noResultTypeAhead = false;
  public customerNameList: string[] = [];
  private customers: any[];

  ngOnInit() {
    this.api.getTransactionDetails({limit: this.loadDataLimit}, (err, data) => {
        this.isTransactionDetailsLoading = false;
        if(err) 
          return;
        this.transactionDetails = data;
    });
    this.api.getCustomers((err, data) => {
        if(err)
          return;
        this.customers = data;
        this.customers.forEach(customer => {
          this.customerNameList.push(customer.name);
        })
    });
  }

  typeaheadNoResults(event: boolean): void {
    this.noResultTypeAhead = event;
    this.transactionForm.form.controls.sourceName.setErrors({'nomatch': true});
  }

  onSelectTypeAhead(event): void {
    console.log(event.item);
    this.transactionForm.form.controls.sourceName.setErrors(null);
  }

  resetTransactionData() {
  	this.transactionForm.reset();
    this.selectedIncomeCategory = this.incomeCategories[0];
    this.selectedExpenseCategory = this.expenseCategories[0];
    setTimeout(() => {
      this.newTransactionData = JSON.parse(JSON.stringify(this.transactionModel));
    }, 0);
  }

  categoryChanged() {
    if(this.selectedIncomeCategory && this.selectedExpenseCategory) {
      this.newTransactionData.incomeType = this.selectedIncomeCategory.types[0];
      this.newTransactionData.expenseType = this.selectedExpenseCategory.types[0];
    }
  }

  addTransaction() {
    this.callInProgress = true;
  	var requestObject = {
  		transactionData: {
  		}
  	}
    this.newTransactionData.incomeCategory = this.selectedIncomeCategory.name;
    this.newTransactionData.expenseCategory = this.selectedExpenseCategory.name;
  	requestObject.transactionData = this.newTransactionData;

  	this.api.addTransaction(requestObject, (err, data) => {
      	this.callInProgress = false;
      	if(err) 
          return;
  	    this.resetTransactionData();
        this.transactionDetails.unshift(data);
        if(this.transactionDetails.length > this.loadDataLimit) {
          this.transactionDetails.pop();
        }
  	});
  }

  /** Upload bill **/
  @ViewChild('fileInput') fileInput;
  private selectedFileName = "Choose File";
  private uploadError = "";
  private isFileSelected: boolean = false;
  private isFileUploading: boolean = false;

  validateFile() {
    let file = this.fileInput.nativeElement;
    if (file.files && file.files[0]) {
      this.selectedFileName = file.files[0].name;
      if(file.files[0].size > 800000) {
        this.uploadError = "File size exceeded 200KB"
      } else if(!(file.files[0].type === "image/png" || file.files[0].type === "image/jpeg")) {
        this.uploadError = "Accepted File types are PNG and JPEG";
      } else {
        this.uploadError = "";
        this.isFileSelected = true;
      }
    }
  }
 
  upload() {
    let file = this.fileInput.nativeElement;
    if (file.files && file.files[0]) {
      this.isFileUploading = true;

      this.api.uploadBill(file.files[0], (err, data) => {
        this.isFileUploading = false;
        if(err)
          return;
        this.newTransactionData.billAttachment.unshift(data);
      });
    }
  }

  calculateFileSize(size) {
    return Math.ceil(size/1024);
  }

  /** Add custome modal **/
  private isAddCustomerInProgress:boolean = false;
  private isModalActive:boolean = false;
  private isAddCustomerSuccess:boolean = false;
  private customerModalError = '';

  @ViewChild('customerDataForm')
  private customerDataForm: NgForm;

  private customerDataModel = {
    name: '',
    phone: '',
    address: ''
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
      if(res && res.success) {
        this.isAddCustomerSuccess = true;
        this.customerNameList.unshift(res.data.name);
        this.customers.unshift(res.data);
        this.noResultTypeAhead = false;
        this.newTransactionData.name = res.data.name;
        this.transactionForm.form.controls.sourceName.setErrors(null);
      } else {
        this.customerModalError = res.reason;
      }
    });
  }

  /** Bill modal **/
  private isBillDeleteInProgress:boolean = false;
  private isBillModalActive:boolean = false;
  private isView:boolean = false;
  private isBillDeleteSuccess:boolean = false;
  private billDeleteModalError = '';
  private modalBillName = '';

  openBillModal(action, itemName) {
    if(action === 'view') {
      this.isView = true;
    } else {
      this.isView = false;
    }
    this.modalBillName = itemName;
    this.isBillModalActive = true;
  }

  closeBillModal() {
    this.isBillDeleteSuccess = false;
    this.isBillModalActive = false;
    this.billDeleteModalError = '';
  }

  deleteBill() {
    this.isBillDeleteInProgress = true;

    this.api.deleteBill(this.modalBillName, (err, res) => {
      this.isBillDeleteInProgress = false;
      if(err) {
        this.billDeleteModalError = "Something went wrong. Please try again !!";
        return;
      }
      if(res && res.success) {
        this.isBillDeleteSuccess = true;
        this.newTransactionData.billAttachment = this.newTransactionData.billAttachment.filter(attachment => { return attachment.filename !== this.modalBillName; });
      } else {
        this.billDeleteModalError = res.reason;
      }
    });
  }

}
