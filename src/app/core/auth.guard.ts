import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserProfileService } from './user-profile.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private userProfileService: UserProfileService,
    private router: Router) { }
  /**
   * used to prevent unauthorized users from accessing certain routes. See docs for more info.
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.userProfileService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login'], {
      queryParams: { redirectTo: state.url }
    });
    return false;
  }

  /**
   *  used to prevent the application from loading entire modules lazily if the user is not authorized to do so.
   */
  canLoad(route: Route) {
    if (this.userProfileService.isAdmin()) {
      return true;
    }
    const url = `/${route.path}`;
    this.router.navigate(['/login'], { queryParams: { redirectTo: url } });
    return false;
  }
}
