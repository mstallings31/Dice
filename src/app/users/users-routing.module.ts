import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPageComponent } from './user-page/user-page.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: '', component: UserPageComponent, canActivate: [AuthGuard] },
  { path: 'edit', component: UserFormComponent, canActivate: [AuthGuard]},
  { path: ':id', component: ProfilePageComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
