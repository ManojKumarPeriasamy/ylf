import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ProfileService {
  private token: string;
  private preferencePage: string;
  private userData = new BehaviorSubject({});
  public userDataCast = this.userData.asObservable();

  setInitialDataOnRefresh() {
    this.userData.next(this.getUserDetails());
  }
  
  constructor(private router: Router) {
    this.setInitialDataOnRefresh();
  }

  private saveToken(token): void {
    localStorage.setItem('yljwt', token);
    this.token = token;
  }

  private getToken(): string {
    return localStorage.getItem('yljwt');
  }

  public getUserDetails() {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      this.preferencePage = JSON.parse(payload).preferencePage;
      return JSON.parse(payload);
    } else {
      return {};
    }
  }

  onSignIn(data) {
	  	this.saveToken(data.token);
	  	this.userData.next(this.getUserDetails());
	  	this.router.navigateByUrl('/' + this.preferencePage);
  }
  
  public logout() {
    this.token = '';
    this.userData.next({});
    window.localStorage.removeItem('yljwt');
    this.router.navigateByUrl('/login');
  }

}