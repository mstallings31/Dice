import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HistoryService } from '../history.service';

const BACKEND_URL = environment.apiUrl + 'user/';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;
  private username: string;

  constructor(private http: HttpClient,
              private router: Router,
              private historyService: HistoryService) {}

  getAuthStatusListener() {
    // This is done so that other mthods cannot emit events
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, username: string) {
    const authData: AuthData = {
      email: email,
      password: password,
      username: username
    };
    this.http.post(BACKEND_URL + "signup", authData)
      .subscribe(response => {
        this.router.navigate([this.historyService.getLastNonLoginUrl()]);
      },
      error => {
        this.authStatusListener.next(false);
        this.router.navigate(['/auth/signup']);
      });
  }

  login(email: string, password: string, username: string) {
    const authData: AuthData = {
      email: email,
      password: password,
      username: username
    };

    this.http.post<{token: string, expiresIn: number, userId: string, username: string}>(BACKEND_URL + "login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = response.token;
        if(token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.username = response.username;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId, this.username);
          this.router.navigate([this.historyService.getLastNonLoginUrl()]);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    // Check expiration date
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.username = authInformation.username;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000)
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.username = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    if( !token || !expirationDate ){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      username: username
    }
  }

  getUsername() {
    return this.username;
  }
};
