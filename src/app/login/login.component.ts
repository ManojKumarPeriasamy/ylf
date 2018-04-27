import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private user: any = {
    username: '',
    password: ''  
  };
  private callInProgress: boolean = false;

  @ViewChild('signinForm')
  private signinForm: NgForm;

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
  }

  signin() {
      this.callInProgress = true;
      this.api.signin(this.user, (err, data) => {
        this.callInProgress = false;
        if (err) {
            return;
        }
      });
  }

  toggleMenu() {
      console.log("admin");
  }

}
