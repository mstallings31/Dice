import { Injectable } from '@angular/core';
import { User } from './models/user-model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + 'user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private authService: AuthService,
              private route: Router) {}

  getUser(id?: string) {
    console.log(id);
    return this.http.get<User>(BACKEND_URL +
      (id ? id : ''));
  }

  updateUser(image: File | string) {
    let userData: {imagePath: string} | FormData;
    if(typeof image === "object") {
      userData = new FormData();
      userData.append("image", image, this.authService.getUsername());
    } else {
      userData = {
        imagePath: image
      }
    }
    this.http.put<any>(BACKEND_URL, userData)
    .subscribe(response => {
      this.route.navigate(['user']);
    }, error => {
      console.log(error);
    })
  }

}
