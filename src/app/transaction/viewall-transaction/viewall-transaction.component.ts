import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-viewall-transaction',
  templateUrl: './viewall-transaction.component.html',
  styleUrls: ['./viewall-transaction.component.css']
})
export class ViewallTransactionComponent implements OnInit {
  private moment;
  private isTransactionDetailsLoading: boolean = true;
  private transactionDetails = [];

  private batchCount = 100;
  private startFrom = 0;

  constructor(private api: ApiService) {
  	this.moment = moment;
  }

  ngOnInit() {
  	this.api.getTransactionDetails({limit: this.batchCount, start: this.startFrom}, (err, data) => {
        this.isTransactionDetailsLoading = false;
        if(err) 
          return;
        this.transactionDetails = data;
    });
  }
}