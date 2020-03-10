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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EllipsisPipe } from './ellipsis.pipe';
import { HtmlLineBreaksPipe } from './html-line-breaks.pipe';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { HeaderComponent } from './header/header.component';

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
    LoginComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
