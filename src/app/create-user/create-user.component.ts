import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  private userModel: any  = {
    username: '',
    role: 'Member',
    countryCode: '91',
    phoneNumber: '',
    emailID: ''
  };

  private newUser:any =  JSON.parse(JSON.stringify(this.userModel));
  public countryCodes: any[] = ['1','91'];
  public userRoles: any[] = ['Admin', 'Manager', 'Member'];

  private callInProgress: boolean = false;

  @ViewChild('createUserForm')
  private createUserForm: NgForm;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  resetUserData() {
  	this.createUserForm.reset();
    setTimeout(() => {
      this.newUser = JSON.parse(JSON.stringify(this.userModel));
    }, 0);
  }

  createUser() {
    this.callInProgress = true;
  	var requestObject = {
  		userData: {}
  	}
  	requestObject.userData = this.newUser;
  	this.api.createUser(requestObject, (err, data) => {
      this.callInProgress = false;
      if(err) 
        return;
  		this.resetUserData();
  	});
  }

}
