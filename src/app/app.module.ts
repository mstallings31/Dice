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
import { EventFormComponent } from './events/event-form/event-form.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { EventMapComponent } from './event-map/event-map.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../environments/environment';
import { SearchBarComponent } from './event-map/search-bar/search-bar.component';
import { EventListComponent } from './event-map/event-list/event-list.component';
import { EventTileComponent } from './event-map/event-list/event-tile/event-tile.component';
import { UserPageComponent } from './user-page/user-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { ReadMoreComponent } from './game-detail/read-more/read-more.component';
import { DateIconComponent } from './events/event-detail/date-icon/date-icon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserFormComponent } from './user-form/user-form.component';

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
    HeaderComponent,
    EventFormComponent,
    EventDetailComponent,
    EventMapComponent,
    SearchBarComponent,
    EventListComponent,
    EventTileComponent,
    UserPageComponent,
    ProfilePageComponent,
    ReadMoreComponent,
    DateIconComponent,
    UserFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleAPIKey
    }),
    FontAwesomeModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
