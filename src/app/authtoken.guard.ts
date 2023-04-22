import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthtokenGuard implements CanActivate {
  constructor(public datePipe: DatePipe, private changeroute: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let today = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    let sessiondate = localStorage.getItem('date');
    if (sessiondate !== today) {
      localStorage.clear();
      this.changeroute.navigateByUrl('login')
    }
    return true;
  }

}
