import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient,
              private router: Router) {}

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
        console.log(response);
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

    this.http.post(BACKEND_URL + "login", authData)
      .subscribe(result => {
        console.log(result);
      }, error => {
        console.log(error);
      });
  }
};
