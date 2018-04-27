import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-view-milk-all',
  templateUrl: './view-milk-all.component.html',
  styleUrls: ['./view-milk-all.component.css']
})
export class ViewMilkAllComponent implements OnInit {
  private moment;
  private isMilkDetailsLoading: boolean = true;
  private milkDetails = [];

  private batchCount = 100;
  private startFrom = 0;

  constructor(private api: ApiService) {
  	this.moment = moment;
  }

  ngOnInit() {
  	this.api.getProductDetails({product: 'Milk', limit: this.batchCount, start: this.startFrom}, (err, data) => {
        this.isMilkDetailsLoading = false;
        if(err) 
          return;
        this.milkDetails = data;
    });
  }

}
