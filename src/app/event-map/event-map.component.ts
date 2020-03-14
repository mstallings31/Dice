import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeolocationService } from '../geolocation.service';
import { GoogleGeocodeService } from '../googleGeocode.service';
import { EventService } from '../events/event.service';
import { GameEvent } from '../models/gameEvent.model';
import { Subscription } from 'rxjs';

interface Coordinates {
  coords: {
    lat: number,
    lng: number
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

  private getEvents(position: any): void {
    // The browser navigator returns an object with "latitude" "longitude"
    // Google returns the same thing as lat/lng.  To avoid an additional
    // function call and overhead, assign the value that isn't null
    this.lat = position.coords.lat || position.coords.latitude;
    this.lng = position.coords.lng || position.coords.longitude;
    this.eventService.getEvents(this.lat, this.lng);
  }

  private showError(error: any): void {
    this.getEvents({coords: {lat: this.lat, lng: this.lng}});
    console.log("Error getting geo...");
  }

  private noGeo(): void {
    console.log("NO GEO GIVEN");
    this.getEvents({coords: {lat: this.lat, lng: this.lng}});
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

  onMapClick(newPosition: Coordinates) {
    this.getEvents(newPosition);
  }

}
