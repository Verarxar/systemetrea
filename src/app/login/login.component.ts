import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login';
import { Subject, Subscription } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { UserProfileService } from '../core/user-profile.service';
import { LoginService, TokenPayload } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  private onDestroy = new Subject();
  intermissionInterval: any;
  counter: number;
  errorCount: number;
  errorMessage: string;
  intermission = false;
  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  constructor(
    private socialAuthService: AuthService, 
    private route: ActivatedRoute,
    private router: Router,
    private userProfileService: UserProfileService,
    private loginService: LoginService) {
      this.errorCount = -1;
      this.intermission = false;
    }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.intermissionInterval) {
      clearInterval(this.intermissionInterval);
    }
  }

  login(f) {
    if (!this.intermission) {
      this.loginService.login(this.credentials)
      .pipe(
        mergeMap(loginResult => this.route.queryParams),
        map(qp => qp['redirectTo']),
        takeUntil(this.onDestroy)
      )
      .subscribe((redirectTo) => {
        this.errorCount = -1;
        if (this.userProfileService.isLoggedIn()) {
          const url = redirectTo ? [redirectTo] : ['/faq'];
          this.router.navigate(url);
        }
      }, (err) => {
        this.errorCount++
        this.setErrorMessage();
      });
    }
  }

  public socialSignIn(socialPlatform : string) {
    if (!this.intermission) {
      let socialPlatformProvider;
      console.log('hello', socialPlatform)
      if(socialPlatform == "google"){
        socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
      }
      this.socialAuthService.signIn(socialPlatformProvider).then(
        (userData) => {
          console.log(socialPlatform+" sign in data : " , userData);
          // Now sign-in with userData
        }
      );
    }
  }

  setErrorMessage() {
    this.errorMessage = `Wrong password/email (or both)\n${5-this.errorCount} attempts remaining`;
    if (this.errorCount >= 5) {
      this.counter = 15;
      this.intermission = true;
      this.startCountDown();
    }
  }

  stopIntervals(interval) {
    clearInterval(interval);
    this.intermission = false;
    this.errorMessage = '';
    this.errorCount = -1;
  }

  startCountDown() {
    this.intermissionInterval = setInterval((intermissionInterval)=> {
      this.counter--;
      if (this.counter === 0) {
        this.stopIntervals(intermissionInterval);
      }
    } ,1000);
  }
}
