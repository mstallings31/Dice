import { Injectable } from '@angular/core';
import { User } from './models/user-model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

const BACKEND_URL = environment.apiUrl + 'user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUser(id?: string) {
    console.log(id);
    return this.http.get<User>(BACKEND_URL +
      (id ? id : ''));
  }

}
