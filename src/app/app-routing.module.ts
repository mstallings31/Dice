import { NgModule } from "@angular/core";
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { GameDetailComponent } from './games/game-detail/game-detail.component';
import { GameFormComponent } from './games/game-form/game-form.component';
import { AuthGuard } from './auth/auth.guard';
import { EventFormComponent } from './events/event-form/event-form.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { EventMapComponent } from './event-map/event-map.component';
import { GameListComponent } from './games/game-list/game-list.component';
import { GameSearchComponent } from './games/game-search/game-search.component';

const appRoutes: Routes = [
  { path: 'game/new', component: GameFormComponent, canActivate: [AuthGuard] },
  { path: 'game/:id', component: GameDetailComponent },
  { path: 'game/:id/edit', component: GameFormComponent, canActivate: [AuthGuard]},
  { path: 'game/:gameId/new', component: EventFormComponent, canActivate: [AuthGuard] },
  { path: 'event/:eventId/edit', component: EventFormComponent, canActivate: [AuthGuard]},
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'user', loadChildren: () => import('./users/user.module').then(m => m.UserModule)},
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '', component: HomepageComponent, children: [
    {path: '', component: EventMapComponent },
    {path: 'nearByEvents', component: EventMapComponent },
    {path: 'popularGames', component: GameListComponent},
    {path: 'allGames', component: GameSearchComponent},
  ] },
];
@NgModule({
  imports: [
      RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
