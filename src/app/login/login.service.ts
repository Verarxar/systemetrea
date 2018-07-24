import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SpinnerService, UserProfileService } from '../core';
import { environment } from '../../environments/environment';

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
  apiBase: string;
  constructor(
    private http: HttpClient,
    private spinnerService: SpinnerService,
    private userProfileService: UserProfileService
  ) {
    this.apiBase = environment.apiBase;
  }

  login(credentials) {
    return this.http.post(`${this.apiBase}/api/login`, credentials).pipe(
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
