import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { mimeType } from '../game-form/mime-type.validator';
import { User } from '../models/user-model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  imagePreview: string;
  user: User;
  isLoading: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });

    this.isLoading = true;

    this.userService.getUser()
    .subscribe(userResponse => {
      this.user = userResponse;
      this.isLoading = false;
      this.form.patchValue({
        image: this.user.imagePath
      });
      this.imagePreview = this.user.imagePath;
    });
  }

  onSaveUser() {
    if(!this.form.valid) {
      return;
    }

    this.userService.updateUser(this.form.value.image);
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image : file });
    this.form.get('image').updateValueAndValidity();

    // Get a string fo our image preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

}
