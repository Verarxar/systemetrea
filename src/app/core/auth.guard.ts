import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router) { }
  /**
   * used to prevent unauthorized users from accessing certain routes. See docs for more info.
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.authenticated) {
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
    if (this.authService.isAdmin) {
      return true;
    }
    const url = `/${route.path}`;
    this.router.navigate(['/login'], { queryParams: { redirectTo: url } });
    return false;
  }
}
