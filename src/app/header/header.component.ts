import { Component, OnInit, ElementRef } from '@angular/core';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class HeaderComponent implements OnInit {
  private userData: any = {};
  private isUserNavMenuOpen: boolean = false;
  private isPageNavMenuOpen: boolean = false;
  constructor(private profile: ProfileService, private _eref: ElementRef) { }

  toggleMenu: boolean = false;
  ngOnInit() {
  	this.profile.userDataCast.subscribe(user => this.userData = user);
  }

  onClick(event) {
   if (!this._eref.nativeElement.contains(event.target)) {
      this.isUserNavMenuOpen = false;
      this.isPageNavMenuOpen = false;
    }
  }

  togglePageNavMenu () {
  	this.isPageNavMenuOpen = !this.isPageNavMenuOpen;
  	this.isUserNavMenuOpen = false;
  }

  toggleUserNavMenu () {
  	this.isUserNavMenuOpen = !this.isUserNavMenuOpen;
  	this.isPageNavMenuOpen = false;
  }

  hideMenuNav() {
    this.isUserNavMenuOpen = false;
    this.isPageNavMenuOpen = false;
  }

  logout () {
    this.isUserNavMenuOpen = false;
  	this.profile.logout();
  }
}