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
import { EventMapComponent } from './event-map/event-map.component';
import { GameListComponent } from './game-list/game-list.component';
import { UserPageComponent } from './user-page/user-page.component';

const appRoutes: Routes = [
  { path: 'game/new', component: GameFormComponent, canActivate: [AuthGuard] },
  { path: 'game/:id', component: GameDetailComponent },
  { path: 'game/:id/edit', component: GameFormComponent, canActivate: [AuthGuard]},
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'game/:gameId/new', component: EventFormComponent, canActivate: [AuthGuard] },
  { path: 'event/:eventId/edit', component: EventFormComponent, canActivate: [AuthGuard]},
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'user', component: UserPageComponent },
  { path: '', component: HomepageComponent, children: [
    {path: '', component: EventMapComponent },
    {path: 'nearByEvents', component: EventMapComponent },
    {path: 'popularGames', component: GameListComponent}
  ] },
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
