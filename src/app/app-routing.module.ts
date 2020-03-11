import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { GameFormComponent } from './game-form/game-form.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { EventFormComponent } from './events/event-form/event-form.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';

const appRoutes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'game/new', component: GameFormComponent, canActivate: [AuthGuard] },
  { path: 'game/:id', component: GameDetailComponent },
  { path: 'game/:id/edit', component: GameFormComponent, canActivate: [AuthGuard]},
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'event/new', component: EventFormComponent },
  { path: 'event/:id', component: EventDetailComponent }
];
@NgModule({
  imports: [
      RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
