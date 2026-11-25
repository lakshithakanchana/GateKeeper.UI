import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authSvc: AuthService, private snackBar: MatSnackBar, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let isLoggedIn = this.authSvc.isLoggedIn();
    
    if(!isLoggedIn) {

      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const expired = this.authSvc.getExpiration() >= yesterday;
      if(expired)
        this.snackBar.open('Your session expired. Please, sign in again!', 'Dismiss', { duration: 5000 });
      else
        this.snackBar.open('Please, sign in first!', 'Dismiss', { duration: 5000 });

      this.router.navigateByUrl('/Login');
      return false;

    }

    let allowedRoles = route.data['roles'] as Array<string>;
    if(allowedRoles !== undefined && allowedRoles !== undefined && allowedRoles.length > 0) {

      let rolesOfTheUser = this.authSvc.getRoles();
      let authorized: boolean = false;
      allowedRoles.forEach((role: string) => {
        if(rolesOfTheUser?.includes(role))
          authorized = true;
      });

      if(!authorized) {
        this.snackBar.open('You have no authority to access that section!', 'Dismiss', {duration: 5000});
        this.router.navigateByUrl('/Forbidden');
      }
      return authorized;

    }

    return true;
  }

}
