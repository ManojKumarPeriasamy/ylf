import { Component, OnInit, Input, ViewChild} from '@angular/core';
import * as moment from 'moment';

import { NgForm } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.css']
})
export class DataEntryComponent implements OnInit {
  private moment;
  private today = moment();
  private productDataModel = {
  	product: 'Milk',
  	entryType: 'IN',
  	jobType: 'Plough',
  	phone: '',
  	name: '',
  	address: '',
  	time: 'Morning',
  	litres: 0,
  	pricePerLitre: 0,
  	noOfRolls: 0,
  	costPerRoll: 0,
    startingUnit: 0,
    endingUnit: 0,
    totalUnits: 0,
  	chargeableUnits: 0,
  	costPerUnit: 0,
  	driverExpense: 0,
  	amount: 0,
  	fatContent: 0,
  	eventOn: {
  		date: this.today.format('DD'),
  		month: this.today.format('MM'),
  		year: this.today.format('YYYY')
  	}
  };

  private newProductData = JSON.parse(JSON.stringify(this.productDataModel));

  private products = ['Milk', 'Tractor'];
  private types = ['IN', 'OUT'];
  private sessions = ['Morning', 'Evening'];

  private jobTypes = ['Plough', 'Grass Baler']

  private callInProgress: boolean = false;
  private isMilkDetailsLoading: boolean = true;
  private isTractorDetailsLoading: boolean = true;
  private isMilkTab: boolean = true;
  private isTractorTab: boolean = false;
  private loadDataLimit:number = 10;
  
  private milkDetails = [];
  private tractorDetails = [];

  @ViewChild('productDataForm')
  private productDataForm: NgForm;

  constructor(private api: ApiService) {
    this.moment = moment;
  }
  
  public noResultTypeAhead = false;
  public customerNameList: string[] = [];
  private customers: any[];

  ngOnInit() {
    this.api.getProductDetails({product: 'Milk', limit: this.loadDataLimit}, (err, data) => {
        this.isMilkDetailsLoading = false;
        if(err) 
          return;
        this.milkDetails = data;
    });
    this.api.getProductDetails({product: 'Tractor', limit: this.loadDataLimit}, (err, data) => {
        this.isTractorDetailsLoading = false;
        if(err) 
          return;
        this.tractorDetails = data;
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
    this.productDataForm.form.controls.name.setErrors({'nomatch': true});
  }

  onSelectTypeAhead(event): void {
    this.setCustomerDefault(event.item);
    this.productDataForm.form.controls.name.setErrors(null);
  }

  setCustomerDefault(customerName) {
    var selectedCustomer: any;
    selectedCustomer = this.customers.find(customer => {
      return customer.name === customerName;
    });
    if(selectedCustomer.phone) this.newProductData.phone = selectedCustomer.phone;
    if(selectedCustomer.address) this.newProductData.address =  selectedCustomer.address;
    if(selectedCustomer.pricePerLitre) this.newProductData.pricePerLitre = selectedCustomer.pricePerLitre;
    if(selectedCustomer.costPerRoll) this.newProductData.costPerRoll = selectedCustomer.costPerRoll;
    if(selectedCustomer.costPerUnit) this.newProductData.costPerUnit = selectedCustomer.costPerUnit;
  }

  calculateAmount() {
  	this.newProductData.amount = this.newProductData.litres * this.newProductData.pricePerLitre;
    this.productDataForm.form.controls.amount.markAsTouched();
  }

  toogleProductTab(product) {
    if(product === 'Milk') {
      this.isMilkTab = true;
      this.isTractorTab = false;
    } else {
      this.isMilkTab = false;
      this.isTractorTab = true;
    }
  }

  calculateTractorAmount() {
  	if(this.newProductData.jobType === 'Grass Baler') {
  		this.newProductData.amount = this.newProductData.noOfRolls * this.newProductData.costPerRoll; 
  	} else {
		  this.newProductData.amount = this.newProductData.chargeableUnits * this.newProductData.costPerUnit;
  	}
    this.productDataForm.form.controls.amount.markAsTouched();
  }

  calculateUnit() {
    this.newProductData.totalUnits = this.newProductData.endingUnit - this.newProductData.startingUnit;
    this.productDataForm.form.controls.totalunits.markAsTouched();
  }

  resetProductData() {
  	this.productDataForm.reset();
    setTimeout(() => {
      this.newProductData = JSON.parse(JSON.stringify(this.productDataModel));
    }, 0);
  }

  addProductData() {
    this.callInProgress = true;
  	var requestObject = {
  		productEntry: {
  		}
  	}
  	requestObject.productEntry = this.newProductData;

  	this.api.addProduct(requestObject, (err, data) => {
      	this.callInProgress = false;
      	console.log(err);
      	if(err) 
          return;
  	    this.resetProductData();
        if(data.product === "Milk") {
          this.milkDetails.unshift(data);
          if(this.milkDetails.length > this.loadDataLimit) this.milkDetails.pop();
        } else {
          this.tractorDetails.unshift(data);
          if(this.tractorDetails.length > this.loadDataLimit) this.tractorDetails.pop();
        }
        this.toogleProductTab(data.product);
  	});
  }
  
  private isAddCustomerInProgress:boolean = false;
  private isModalActive:boolean = false;
  private isAddCustomerSuccess:boolean = false;
  private customerModalError = '';

  @ViewChild('customerDataForm')
  private customerDataForm: NgForm;

  private customerDataModel = {
    name: '',
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
      if(res && res.success) {
        this.isAddCustomerSuccess = true;
        this.customerNameList.unshift(res.data.name);
        this.customers.unshift(res.data);
        this.noResultTypeAhead = false;
        this.newProductData.name = res.data.name;
        this.setCustomerDefault(res.data.name);
        this.productDataForm.form.controls.name.setErrors(null);
      } else {
        this.customerModalError = res.reason;
      }
    });
  }

}
