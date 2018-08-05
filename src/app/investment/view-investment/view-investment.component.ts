import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-view-investment',
  templateUrl: './view-investment.component.html',
  styleUrls: ['./view-investment.component.css']
})
export class ViewInvestmentComponent implements OnInit {
  private moment;
  private id;
  private paramSub;
  private isInvestmentDataLoading: boolean = true;

  private investmentData = {};
  private editData = {
  	eventOn : {
  		date: '',
  		month: '',
  		year: ''
  	},
    type: '',
    amount: 0,
    purpose: '',
    loanDetails: {
      totalRepayAmount: 0,
      loanStatus: 'Active',
      totalLoanAmountPaid: 0,
      emiDetails : {
        term: 0,
        amount: 0,
        isInterestOnly: 'NO',
        eventOn: {
          date: '',
          month: '',
          year: ''
        },
        termsEMIPaid: 0,
        remindBefore: '',
        userToRemind: ''
      }
    },
  	remarks: ''
  };
  private initialEditValue = {};

  private loanStatus = ['Active', 'Closed'];
  private adminUsers = [];

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

        this.api.getTransactionById({id: this.id}, (err, data) => {
    			this.isInvestmentDataLoading = false;
          if(err)
    				return;
    			this.investmentData = data;
        });

        this.api.getAdminList((err, data) => {
          if(err)
            return;
          data.forEach(admin => {
              this.adminUsers.push(admin.username);
          })
        });
    });
  }

  populateEditData(data) {
  	this.editData.amount = data.amount;
    this.editData.type = data.type;
  	this.editData.eventOn.date = data.eventOn.date;
  	this.editData.eventOn.month = data.eventOn.month;
  	this.editData.eventOn.year = data.eventOn.year;
  	this.editData.purpose = data.purpose;
  	this.editData.remarks = data.remarks;
    this.editData.loanDetails = data.loanDetails;
  	this.initialEditValue = JSON.stringify(this.editData);
  }

  isEditDataChanged() {
  	return (this.initialEditValue === JSON.stringify(this.editData));
  }

  calcualteEMIAmount() {
      this.editData.loanDetails.emiDetails.amount = this.editData.loanDetails.totalRepayAmount / this.editData.loanDetails.emiDetails.term;
  }

  editEntry() {
  	this.isEditMode = true;
  	this.isEditInProgress = false;
  	this.populateEditData(this.investmentData);
  	this.alert.removeAlert();
  }

  updateEntry() {
  	this.isEditInProgress = true;
  	var updateData = {
  		id: this.id,
  		editData: this.editData
  	};
  	this.api.updateInvestmentById({updateObject: updateData}, (err, data) => {
		this.isEditInProgress = false;
		if(err) {
			return;
		} else {
			console.log(data);
			this.isEditMode = false;
			this.investmentData = data.value;
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
    	this.router.navigateByUrl('/investment/viewall');
    	this.isDeleteSuccess = false;
    }
  	this.isModalActive = false;
  }

  deleteEntry() {
  	this.isDeleteInProgress = true;
  	this.api.deleteTransactionById({id: this.id}, (err, data) => {
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
