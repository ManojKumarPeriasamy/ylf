import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../services/api.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  private isCustomerReportDataLoading: boolean = true;
  private paramSub;
  private customerReportData = [];
  private customerName;
  private customerType;
  private aggregateInfo;
  private processedAggregate = {
    income : [],
    incomeAmount : 0,
    expense : [],
    expenseAmount : 0,
    totalMilkIn : 0,
    totalMilkOut : 0,
    ploughAmount : 0,
    balerAmount : 0,
    balance : 0
  };
  private balance = 0;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router, private alert: AlertService) { }

  ngOnInit() {
  	this.paramSub = this.route.params.subscribe(params => {
        this.customerName = params['customerName'];
        this.customerType = params['customerType'];

        this.api.getCustomerReport({name: this.customerName, type: this.customerType}, (err, data) => {
    	  	this.isCustomerReportDataLoading = false;
        	if(err)
			      return;
          this.calculateTotal(data.aggregateResponse);
          this.calculateCustomerBalance(data.reports);
        });
    });
  }

  calculateTotal(aggregateResposne) {
    aggregateResposne.forEach((entry) => {
      var id = entry._id;
      if(id.product) {
        if(id.product === 'Milk' && id.entryType === 'IN') {
          this.processedAggregate.totalMilkIn = entry.amount;
        } else if(id.product === 'Milk' && id.entryType === 'OUT') {
          this.processedAggregate.totalMilkOut = entry.amount;
        } else if(id.product === 'Tractor' && id.jobType === 'Plough') {
          this.processedAggregate.ploughAmount = entry.amount;
        } else if(id.product === 'Tractor' && id.jobType === 'Grass Baler') {
          this.processedAggregate.balerAmount = entry.amount;
        }
      } else if(id.majorType) {
        if(id.majorType === "Income") {
          this.processedAggregate.income.push(entry);
          this.processedAggregate.incomeAmount = this.processedAggregate.incomeAmount + entry.amount;
        } else if(id.majorType === "Expense") {
          this.processedAggregate.expense.push(entry);
          this.processedAggregate.expenseAmount = this.processedAggregate.incomeAmount + entry.amount;
        }
      }
    });
    this.processedAggregate.balance = this.balance = (this.processedAggregate.totalMilkIn + 
                        this.processedAggregate.incomeAmount) - (this.processedAggregate.totalMilkOut + 
                        this.processedAggregate.ploughAmount + this.processedAggregate.balerAmount + 
                        this.processedAggregate.expenseAmount);
  }
  
  calculateCustomerBalance(reports) {
  	reports.forEach((report) => {
  		if((report.productId && report.entryType !== 'IN') || (report.transactionId && report.majorType === 'Expense')) {
  			report.calculatedBalance = this.balance;
        this.balance = this.balance + parseFloat(report.amount);
  		} else {
        report.calculatedBalance = this.balance;
  			this.balance = this.balance - parseFloat(report.amount); 
  		}
  		this.customerReportData.push(report);
  	})
  }

  ngOnDestroy() {
    this.paramSub.unsubscribe();
  }

}