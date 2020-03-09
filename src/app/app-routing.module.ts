import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { GameDetailComponent } from './game-detail/game-detail.component';

const appRoutes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'game/:id', component: GameDetailComponent }
];
@NgModule({
  imports: [
      RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
