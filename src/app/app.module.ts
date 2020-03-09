import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AdvertisingBannerComponent } from './advertising-banner/advertising-banner.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AppRoutingModule } from './app-routing.module';
import { GameCardComponent } from './game-list/game-card/game-card.component';
import { GameListComponent } from './game-list/game-list.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { GameFormComponent } from './game-form/game-form.component';

@NgModule({
  declarations: [
    AppComponent,
    AdvertisingBannerComponent,
    HomepageComponent,
    GameCardComponent,
    GameListComponent,
    GameDetailComponent,
    GameFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
