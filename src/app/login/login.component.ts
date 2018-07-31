import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import { TokenPayload } from '../core/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, OnDestroy {
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
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) {
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
      this.authService.login(this.credentials)
        .pipe(
          mergeMap(loginResult => this.route.queryParams),
          map(qp => qp['redirectTo']),
          takeUntil(this.onDestroy)
        )
        .subscribe((redirectTo) => {
          this.errorCount = -1;
          if (this.authService.authenticated) {
            const url = redirectTo ? [redirectTo] : ['/faq'];
            this.router.navigate(url);
          }
        }, (err) => {
          this.errorCount++;
          this.setErrorMessage();
        });
    }
  }

  setErrorMessage() {
    this.errorMessage = `Wrong password/email (or both)\n${5 - this.errorCount} attempts remaining`;
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
    this.intermissionInterval = setInterval((intermissionInterval) => {
      this.counter--;
      if (this.counter === 0) {
        this.stopIntervals(intermissionInterval);
      }
    }, 1000);
  }
}
