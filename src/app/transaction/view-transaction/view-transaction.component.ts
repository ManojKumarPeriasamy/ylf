import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.css']
})
export class ViewTransactionComponent implements OnInit {
  private moment;
  private id;
  private paramSub;
  private isTransactionDataLoading: boolean = true;

  private transactionData = {};
  private editData = {
    majorType: '',
    totalExpense: 0,
  	amount: 0,
  	eventOn : {
  		date: '',
  		month: '',
  		year: ''
  	},
    billAttachment: [],
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

        this.api.getTransactionById({id: this.id}, (err, data) => {
          this.isTransactionDataLoading = false;
    			if(err)
    				return;
    			this.transactionData = data;
        });
    });
  }

  populateEditData(data) {
    this.editData.majorType = data.majorType;
    this.editData.totalExpense = data.totalExpense;
  	this.editData.amount = data.amount;
  	this.editData.eventOn.date = data.eventOn.date;
  	this.editData.eventOn.month = data.eventOn.month;
  	this.editData.eventOn.year = data.eventOn.year;
  	this.editData.remarks = data.remarks;
    this.editData.billAttachment = data.billAttachment;
  	this.initialEditValue = JSON.stringify(this.editData);
  }

  isEditDataChanged() {
  	return (this.initialEditValue === JSON.stringify(this.editData));
  }

  editEntry() {
  	this.isEditMode = true;
  	this.isEditInProgress = false;
  	this.populateEditData(this.transactionData);
  	this.alert.removeAlert();
  }

  updateEntry() {
  	this.isEditInProgress = true;
  	var updateData = {
  		id: this.id,
  		editData: this.editData
  	}
  	this.api.updateTransactionById({updateObject: updateData}, (err, data) => {
		this.isEditInProgress = false;
		if(err) {
			return;
		} else {
			console.log(data);
			this.isEditMode = false;
			this.transactionData = data.value;
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
    	this.router.navigateByUrl('/transaction/viewall');
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

  /** Bill modal **/
  private isBillModalActive:boolean = false;
  private modalBillName = '';

  openBillModal(itemName) {
    this.modalBillName = itemName;
    this.isBillModalActive = true;
  }

  closeBillModal() {
    this.isBillModalActive = false;
  }

  removeBill(billName) {
    this.editData.billAttachment = this.editData.billAttachment.filter(function (attachment) {
      return attachment.filename !== billName;
    })
  }

  /** Upload bill **/
  @ViewChild('fileInput') fileInput;
  private selectedFileName = "Choose File";
  private uploadError = "";
  private isFileSelected: boolean = false;
  private isFileUploading: boolean = false;

  validateFile() {
    this.isFileSelected = false;
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
        this.editData.billAttachment.unshift(data);
      });
    }
  }

  calculateFileSize(size) {
    return Math.ceil(size/1024);
  }
}
