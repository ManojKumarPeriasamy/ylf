import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-viewall-investment',
  templateUrl: './viewall-investment.component.html',
  styleUrls: ['./viewall-investment.component.css']
})
export class ViewallInvestmentComponent implements OnInit {
  private moment;
  private isInvestmentDetailsLoading: boolean = true;
  private investmentDetails = [];

  private batchCount = 100;
  private startFrom = 0;

  constructor(private api: ApiService) {
  	this.moment = moment;
  }

  ngOnInit() {
  	this.api.getInvestmentDetails({limit: this.batchCount, start: this.startFrom}, (err, data) => {
        this.isInvestmentDetailsLoading = false;
        if(err) 
          return;
        this.investmentDetails = data;
    });
  }
}
