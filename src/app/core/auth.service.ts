import { Injectable, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserProfile, TokenResponse } from './models';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiBase: string;
  userProfile: UserProfile;
  token: string;
  expiresAt: number;

  isAdmin: boolean;
  isAdmin$ = new BehaviorSubject<boolean>(this.isAdmin);
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  constructor(private router: Router, private http: HttpClient) {
    this.apiBase = environment.apiBase;
    this.checkSession();
  }

  get authenticated(): boolean {
    return this.expiresAt > Date.now() / 1000 && this.loggedIn;
  }

  login(credentials) {
    return this.http.post(`${this.apiBase}/api/login`, credentials).pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
          let payload = data.token.split('.')[1];
          payload = JSON.parse(window.atob(payload));
          this._setSession(payload);
        }
        return data;
      })
    );
  }

  public getUserDetails(): UserProfile {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  private _setSession(profile) {
    console.log('profile', profile);
    if (profile) {
      this.expiresAt = profile.exp;
      this.userProfile = profile;
    } else {
      const exp = new Date();
      this.token = null;
      this.expiresAt = exp.getTime() / 1000;
    }
    this._setAdminStatus(profile ? profile.admin || false : false);
    this._setLoggedIn(!!profile);
  }

  private _setAdminStatus(value: boolean) {
    this.isAdmin$.next(value);
    this.isAdmin = value;
  }

  private _setLoggedIn(value: boolean) {
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  public logout(): void {
    window.localStorage.removeItem('mean-token');
    this._setSession(null);
  }

  private checkSession(): void {
    const token = this.getToken();
    const profile = this.getTokenContent(token);
    this._setSession(profile);
    
  }

  getAuthorizationHeader() {
    return [
      `Bearer ${this.token}`,
    ];
  }

  private getTokenContent(token) {
    if (token) {
      let payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

}
