import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-view-tractor-all',
  templateUrl: './view-tractor-all.component.html',
  styleUrls: ['./view-tractor-all.component.css']
})
export class ViewTractorAllComponent implements OnInit {
  private moment;
  private isTractorDetailsLoading: boolean = true;
  private tractorDetails = [];

  private batchCount = 100;
  private startFrom = 0;

  constructor(private api: ApiService) {
  	this.moment = moment;
  }

  ngOnInit() {
  	this.api.getProductDetails({product: 'Tractor', limit: this.batchCount, start: this.startFrom}, (err, data) => {
        this.isTractorDetailsLoading = false;
        if(err) 
          return;
        this.tractorDetails = data;
    });
  }

}
