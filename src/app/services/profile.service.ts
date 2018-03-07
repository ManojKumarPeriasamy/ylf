import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './api.service';

@Injectable()
export class ProfileService {
  private token: string;
  private userData: any;
  constructor(private api: ApiService, private router: Router) {}

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
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public signin(credential) {
	  this.api.signin(credential, (data) => {
	  	this.saveToken(data.token);
	  	this.userData = this.getUserDetails();
	  	this.router.navigateByUrl('/' + this.userData.preferenceFirstLoad);
	  });
  }
  
  public logout() {
    this.token = '';
    this.userData = {};
    window.localStorage.removeItem('yljwt');
    this.router.navigateByUrl('/');
  }

  public isLoggedIn() {
  	return this.token ? true : false;
  }

  public getUsername() {
  	return this.userData.username;
  }

  public isAdmin() {
  	return this.userData.role == 'admin' ? true : false;
  }

  public isManager() {
  	return this.userData.role == 'manager' ? true : false;
  }

  public isMember() {
  	return this.userData.role == 'member' ? true : false;
  }

}