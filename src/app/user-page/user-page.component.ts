import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../models/user-model';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  user: User;
  isLoading: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getUser()
    .subscribe(userResponse => {
      this.user = userResponse;
      this.isLoading = false;
    });
  }
}
