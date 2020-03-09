import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { GameFormComponent } from './game-form/game-form.component';

const appRoutes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'game/new', component: GameFormComponent },
  { path: 'game/:id', component: GameDetailComponent },
  { path: 'game/:id/edit', component: GameFormComponent }
];
@NgModule({
  imports: [
      RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
