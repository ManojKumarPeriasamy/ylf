import { Component, OnInit, Input, ViewChild} from '@angular/core';

import { NgForm } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.css']
})
export class DataEntryComponent implements OnInit {
  private productDataModel = {
  	product: 'Milk',
  	entryType: 'IN',
  	jobType: 'Plough',
  	name: '',
  	time: 'Morning',
  	litres: 0,
  	pricePerLitre: 0,
  	amount: 0,
  	fatContent: 0,
  	eventOn: {
  		date: '',
  		month: '',
  		year: ''
  	}
  };

  private newProductData =  Object.assign({}, this.productDataModel);

  private products = ['Milk', 'Tractor'];
  private types = ['IN', 'OUT'];
  private sessions = ['Morning', 'Evening'];

  private jobTypes = ['Plough', 'Grass Baler']

  private callInProgress: boolean = false;

  @ViewChild('productDataForm')
  private productDataForm: NgForm;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  calculateAmount() {
  	var litres = this.productDataForm.form.controls.litres;
  	var pricePerLitre = this.productDataForm.form.controls.pricePerLitre;
  	this.newProductData.amount = this.newProductData.litres * this.newProductData.pricePerLitre;
  }

  resetTransactionData() {
  	this.productDataForm.reset();
    setTimeout(() => {
      this.newProductData = Object.assign({}, this.productDataModel);
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
  	    this.resetTransactionData();
  	});
  }

}
