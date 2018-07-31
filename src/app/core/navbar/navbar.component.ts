import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserProfile } from '../models';

class MenuItem {
  constructor(public caption: string, public link: any[], public hide?: boolean) { }
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {
  loggedInSub: Subscription;
  loggedIn: boolean;
  isAdminSub: Subscription;
  isAdmin: boolean;
  profile: UserProfile;
  hideCanvas = true;
  menuItems: MenuItem[];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loggedInSub = this.authService.loggedIn$.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
      this.profile = this.authService.getUserDetails();
      console.log('loggedIn: ', this.loggedIn);
    });
    this.isAdminSub = this.authService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
      console.log('isAdmin: ', this.isAdmin);
    });
  }

  isLoggedIn(): boolean {
    return this.authService.authenticated;
  }

  toggleOffCanvas() {
    this.hideCanvas = !this.hideCanvas;
  }

  logout() {
    this.authService.logout();
    this.hideCanvas = true;
    this.router.navigate(['/login']);
  }
}
