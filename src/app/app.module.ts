import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AdvertisingBannerComponent } from './advertising-banner/advertising-banner.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { HeaderComponent } from './homepage/header/header.component';
import { EventMapComponent } from './event-map/event-map.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../environments/environment';
import { SearchBarComponent } from './event-map/search-bar/search-bar.component';
import { EventListComponent } from './event-map/event-list/event-list.component';
import { EventTileComponent } from './event-map/event-list/event-tile/event-tile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from './homepage/footer/footer.component';
import { GamesModule } from './games/game.module';
import { EventsModule } from './events/event.module';

@NgModule({
  declarations: [
    AppComponent,
    AdvertisingBannerComponent,
    HomepageComponent,
    HeaderComponent,
    EventMapComponent,
    SearchBarComponent,
    EventListComponent,
    EventTileComponent,
    FooterComponent,
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
    GamesModule,
    EventsModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
