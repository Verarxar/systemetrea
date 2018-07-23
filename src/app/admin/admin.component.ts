import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SpinnerService, UserProfileService } from '../core';
import { tap } from 'rxjs/operators';

interface TokenResponse {
  token: string;
}
class Credentials {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {
  error: string;
  success: boolean;
  credentials: Credentials = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private http: HttpClient,
    private spinnerService: SpinnerService,
    private userProfileService: UserProfileService
  ) {
    this.success = false;
  }

  ngOnInit() {
  }

  register() {
    this.success = false;
    this.http.post('http://systemetrea.eu/api/register', this.credentials).pipe(
      tap(_ => this.spinnerService.show())).subscribe((res: TokenResponse) => {
        this.error = '';
        this.toggleLogState(res);
      }, (err) => {
        this.error = err.message;
      });
  }

  private toggleLogState(res: TokenResponse) {
    if (res.token) {
      this.handleSuccess();
      this.spinnerService.hide();
    }
  }

  handleSuccess() {
    this.credentials = new Credentials();
    this.success = true;
  }
}
