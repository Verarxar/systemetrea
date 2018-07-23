import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  admin: boolean;
  iat: number;
}

interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private token: string;
  hasAdminAccess = false;

  constructor(private router: Router) {}

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      this.hasAdminAccess = user.admin;
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public isAdmin(): boolean {
    return this.hasAdminAccess;
  }

  public getUserDetails(): UserDetails {
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

  saveToken(token) {
    const request = token.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToStorage(data.token);
        }
        return data;
      })
    );
  }

  saveToStorage(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  public logout(): void {
    this.hasAdminAccess = false;
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.router.navigateByUrl('/');
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }
}
