import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private profile: ProfileService, private router: Router) { }

  user: any = {
  	username: '',
  	password: ''	
  };

  ngOnInit() {
  }

  signin() {
      this.profile.signin(this.user);
  }

}
