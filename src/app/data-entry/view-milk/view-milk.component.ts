import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-view-milk',
  templateUrl: './view-milk.component.html',
  styleUrls: ['./view-milk.component.css']
})
export class ViewMilkComponent implements OnInit {
  private moment;
  private id;
  private paramSub;
  private isMilkDataLoading: boolean = true;

  private milkData = {};
  private editData = {
  	litres: 0,
  	pricePerLitre: 0,
  	amount: 0,
  	eventOn : {
  		date: '',
  		month: '',
  		year: ''
  	},
  	fatContent: '',
  	remarks: ''
  };
  private initialEditValue = {};

  private isDeleteInProgress:boolean = false;
  private isModalActive:boolean = false;
  private isDeleteSuccess:boolean = false;
  private isEditMode:boolean = false;
  private isEditInProgress:boolean = false;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router, private alert: AlertService) {
  	this.moment = moment;
  }

  ngOnInit() {
    this.paramSub = this.route.params.subscribe(params => {
        this.id = params['id'];

        this.api.getProductById({id: this.id}, (err, data) => {
    			this.isMilkDataLoading = false;
    			if(err) 
    				return;
    			this.milkData = data;
        });
    });
  }

  populateEditData(data) {
	this.editData.litres = data.litres;
	this.editData.pricePerLitre = data.pricePerLitre;
	this.editData.amount = data.amount;
	this.editData.eventOn.date = data.eventOn.date;
	this.editData.eventOn.month = data.eventOn.month;
	this.editData.eventOn.year = data.eventOn.year;
	this.editData.fatContent = data.fatContent;
	this.editData.remarks = data.remarks;
	this.initialEditValue = JSON.stringify(this.editData);
  }

  isEditDataChanged() {
  	return (this.initialEditValue === JSON.stringify(this.editData));
  }

  calculateAmount() {
  	this.editData.amount = this.editData.litres * this.editData.pricePerLitre;
  }

  editEntry() {
  	this.isEditMode = true;
  	this.isEditInProgress = false;
  	this.populateEditData(this.milkData);
  	this.alert.removeAlert();
  }

  updateEntry() {
  	this.isEditInProgress = true;
  	var updateData = {
  		id: this.id,
  		editData: this.editData
  	}
  	this.api.updateMilkProductById({updateObject: updateData}, (err, data) => {
		this.isEditInProgress = false;
		if(err) {
			return;
		} else {
			console.log(data)
			this.isEditMode = false;
			this.milkData = data.value;
		}
    });
  }

  cancelEdit() {
  	this.isEditMode = false;
  }

  openModal() {
  	this.isModalActive = true;
  }

  closeModal() {
    if(this.isDeleteSuccess) {
    	this.router.navigateByUrl('/product-entry/milk/all');
    	this.isDeleteSuccess = false;
    }
  	this.isModalActive = false;
  }

  deleteEntry() {
  	this.isDeleteInProgress = true;
  	this.api.deleteProductById({id: this.id}, (err, data) => {
  		if(err)
  			return;
  		this.isDeleteInProgress = false;
  		this.isDeleteSuccess = true;
    });
  }

  ngOnDestroy() {
    this.paramSub.unsubscribe();
  }

}
