import { Injectable } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { ProfileService } from '../services/profile.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  isLoggedIn: boolean = false;
  userData: any;
  constructor(
    private router: Router,
    private profile: ProfileService
  ) {}
 
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.profile.userDataCast.subscribe(user => this.userData = user);
    this.isLoggedIn = !!this.userData.username;

    if(state.url === '/login' && this.isLoggedIn) {
      this.router.navigate(['/' + this.userData.preferencePage]);
      return false;
    } else if (this.isLoggedIn) {
      return true;
    } else if(state.url !== '/login') {
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }

}