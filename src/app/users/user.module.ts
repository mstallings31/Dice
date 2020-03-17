import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserPageComponent } from './user-page/user-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [
    ProfilePageComponent,
    UserFormComponent,
    UserPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule
  ]
})
export class UserModule {}
