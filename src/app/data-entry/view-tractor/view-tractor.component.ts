import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-view-tractor',
  templateUrl: './view-tractor.component.html',
  styleUrls: ['./view-tractor.component.css']
})
export class ViewTractorComponent implements OnInit {
  private moment;
  private id;
  private paramSub;
  private isTractorDataLoading: boolean = true;

  private tractorData = {};
  private editData = {
  	jobType: '',
  	startingUnit: 0,
  	endingUnit: 0,
  	totalUnits: 0,
  	chargeableUnits: 0,
  	costPerUnit: 0,
    driverName: '',
  	driverExpense: 0,
  	amount: 0,
  	noOfRolls: 0,
  	costPerRoll: 0,
  	eventOn : {
  		date: '',
  		month: '',
  		year: ''
  	},
  	address: '',
  	remarks: ''
  };
  private initialEditValue = {};

  private isDeleteInProgress:boolean = false;
  private isModalActive:boolean = false;
  private isDeleteSuccess:boolean = false;
  private isEditMode:boolean = false;
  private isEditInProgress:boolean = false;

  private driverNameList = [];

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router, private alert: AlertService) {
  	this.moment = moment;
  }

  ngOnInit() {
    this.paramSub = this.route.params.subscribe(params => {
        this.id = params['id'];

        this.api.getProductById({id: this.id}, (err, data) => {
          this.isTractorDataLoading = false;
    			if(err) 
    				return;
    			this.tractorData = data;
        });
        this.api.getCustomers((err, data) => {
          if(err)
            return;
          data.forEach(customer => {
            if(customer.type === 'Driver') {
              this.driverNameList.unshift(customer.name);
            }
          })
        });
    });
  }

  populateEditData(data) {
  	this.editData.jobType = data.jobType;
  	this.editData.startingUnit = data.startingUnit;
  	this.editData.endingUnit = data.endingUnit;
  	this.editData.totalUnits = data.totalUnits;
  	this.editData.chargeableUnits = data.chargeableUnits;
  	this.editData.costPerUnit = data.costPerUnit;
    this.editData.driverName = data.driverName;
  	this.editData.driverExpense = data.driverExpense;
  	this.editData.noOfRolls = data.noOfRolls;
  	this.editData.costPerRoll = data.costPerRoll;
  	this.editData.amount = data.amount;
  	this.editData.eventOn.date = data.eventOn.date;
  	this.editData.eventOn.month = data.eventOn.month;
  	this.editData.eventOn.year = data.eventOn.year;
  	this.editData.address = data.address;
  	this.editData.remarks = data.remarks;
  	this.initialEditValue = JSON.stringify(this.editData);
  }

  isEditDataChanged() {
  	return (this.initialEditValue === JSON.stringify(this.editData));
  }

  calculateTractorAmount() {
  	if(this.editData.jobType === 'Grass Baler') {
  		this.editData.amount = this.editData.noOfRolls * this.editData.costPerRoll; 
  	} else {
		  this.editData.amount = this.editData.chargeableUnits * this.editData.costPerUnit;
  	}
  }

  calculateUnit() {
    this.editData.totalUnits = this.editData.endingUnit - this.editData.startingUnit;
  }

  editEntry() {
  	this.isEditMode = true;
  	this.isEditInProgress = false;
  	this.populateEditData(this.tractorData);
  	this.alert.removeAlert();
  }

  updateEntry() {
  	this.isEditInProgress = true;
  	var updateData = {
  		id: this.id,
  		editData: this.editData
  	}
  	this.api.updateTractorDataById({updateObject: updateData}, (err, data) => {
		this.isEditInProgress = false;
		if(err) {
			return;
		} else {
			console.log(data)
			this.isEditMode = false;
			this.tractorData = data.value;
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
    	this.router.navigateByUrl('/product-entry/tractor/all');
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