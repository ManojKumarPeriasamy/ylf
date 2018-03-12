import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AlertService {
  private isAlertPresent = new BehaviorSubject(false);
  public isAlertCast = this.isAlertPresent.asObservable();

  private alert = new BehaviorSubject({type : '', message: ''});
  public alertCast = this.alert.asObservable();
  
  constructor() {}

  public setAlert(alertType, alertMessage) {
    this.alert.next({type : alertType, message: alertMessage});
    this.isAlertPresent.next(true);
    window.scrollTo(0, 0);
  }

  public removeAlert(){
    this.isAlertPresent.next(false);
    this.alert.next({type : '', message: ''})
  }

}