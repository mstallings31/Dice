import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user-model';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  user: User;
  isLoading: boolean = false;
  id: string;

  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.id = this.activatedRoute.snapshot.params['id'];
    this.userService.getUser(this.id)
      .subscribe(userResponse => {
        this.user = userResponse;
        this.isLoading = false;
      });
  }
}
