import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SpinnerService, UserProfileService } from '../core';

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class LoginService {

  constructor(
    private http: HttpClient,
    private spinnerService: SpinnerService,
    private userProfileService: UserProfileService
  ) { }

  login(credentials) {
    return this.http.post('http://systemetrea.eu/api/login', credentials).pipe(
      tap(_ => this.spinnerService.show()),
      delay(1000),
      tap(this.toggleLogState.bind(this))
    );
  }

  private toggleLogState(res: TokenResponse) {
    if (res.token) {
      this.userProfileService.saveToStorage(res.token);
    }
    this.spinnerService.hide();
  }
}
