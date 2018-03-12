import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart } from '@angular/router';

import { AlertService } from './services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isAlertPresent: boolean = false;
  alert: any = {
	  type: '',
	  message: ''
	};

  constructor(public router: Router, public alertService: AlertService) {}

  ngOnInit() {
  	this.alertService.isAlertCast.subscribe(isAlertPresent => this.isAlertPresent = isAlertPresent);
  	this.alertService.alertCast.subscribe(alert => this.alert = alert);

    this.router.events.subscribe( (e) => {
      if (e instanceof NavigationStart) {
          this.alertService.removeAlert();
      }
    });
  }

  
}