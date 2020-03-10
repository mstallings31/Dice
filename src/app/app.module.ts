import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AdvertisingBannerComponent } from './advertising-banner/advertising-banner.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AppRoutingModule } from './app-routing.module';
import { GameCardComponent } from './game-list/game-card/game-card.component';
import { GameListComponent } from './game-list/game-list.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { GameFormComponent } from './game-form/game-form.component';
import { HttpClientModule } from '@angular/common/http';
import { EllipsisPipe } from './ellipsis.pipe';
import { HtmlLineBreaksPipe } from './html-line-breaks.pipe';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    AdvertisingBannerComponent,
    HomepageComponent,
    GameCardComponent,
    GameListComponent,
    GameDetailComponent,
    GameFormComponent,
    EllipsisPipe,
    HtmlLineBreaksPipe,
    SignupComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
