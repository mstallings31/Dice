import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeolocationService } from '../geolocation.service';
import { GoogleGeocodeService } from '../googleGeocode.service';
import { EventService } from '../events/event.service';
import { GameEvent } from '../models/gameEvent.model';
import { Subscription } from 'rxjs';

interface Coordinates {
  coords: {
    latitude: number,
    longitude: number
  }
};

@Component({
  selector: 'app-event-map',
  templateUrl: './event-map.component.html',
  styleUrls: ['./event-map.component.css']
})
export class EventMapComponent implements OnInit, OnDestroy {
  lng: number = -97.830745;
  lat: number = 30.508007;
  zoom: number = 10;
  isFetching: boolean = false;
  events: GameEvent[];
  eventSubscription: Subscription;
  selectedEvent: GameEvent;

  constructor(private geoLocationService: GeolocationService,
              private googleGeocodeService: GoogleGeocodeService,
              private eventService: EventService) { }

  ngOnInit(): void {
    this.isFetching = true;
    this.getPosition();
    this.eventSubscription = this.eventService.getEventsUpdateListener()
      .subscribe((eventData: GameEvent[]) => {
        this.events = eventData;
        this.isFetching = false;
      });
  }

  private getPosition(): void {
    this.isFetching = true;
    this.geoLocationService.getPosition(
      this.getEvents.bind(this),
      this.showError.bind(this),
      this.noGeo.bind(this));
  }

  private getEvents(position: Coordinates): void {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
    this.eventService.getEvents(this.lat, this.lng);
  }

  private showError(error: any): void {
    this.getEvents({coords: {latitude: this.lat, longitude: this.lng}});
    console.log("Error getting geo...");
  }

  private noGeo(): void {
    console.log("NO GEO GIVEN");
    this.getEvents({coords: {latitude: this.lat, longitude: this.lng}});
  }

  newSearch(address: string) {
    this.googleGeocodeService.translateCoordinates(address).subscribe((coords)=>{
      this.getEvents({coords});
    });
  }

  onEventSelected(event: GameEvent) {
    this.selectedEvent = event;
  }

  onMarkerClick(event: GameEvent) {
    this.selectedEvent = event;
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }

}
