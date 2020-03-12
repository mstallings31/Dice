import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GoogleGeocodeService } from '../googleGeocode.service';
import { GameEvent } from '../models/gameEvent.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

const BACKEND_URL = environment.apiUrl + 'events/';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: GameEvent[];
  private eventsUpdated = new Subject<GameEvent[]>();
  private event: GameEvent;
  private eventUpdated = new Subject<GameEvent>();

  constructor(private http: HttpClient,
              private googleGeocodeService: GoogleGeocodeService,
              private router: Router) {}

  addEvent(gameId: string,
           streetAddress: string,
           city: string,
           state: string,
           zipCode: string,
           date: string,
           eventDetails: string) {

    const eventData = {
      gameId: gameId,
      streetAddress: streetAddress,
      city: city,
      state: state,
      zipCode: zipCode,
      date: date,
      eventDetails: eventDetails
    };

    this.http.post<GameEvent>(BACKEND_URL, eventData)
      .subscribe(responseData => {
        this.router.navigate(['event', responseData._id]);
    });
  }

  updateEvent(gameId: string,
    streetAddress: string,
    city: string,
    state: string,
    zipCode: string,
    date: string,
    eventDetails: string,
    eventId: string) {
      const eventData = {
        gameId: gameId,
        streetAddress: streetAddress,
        city: city,
        state: state,
        zipCode: zipCode,
        date: date,
        eventDetails: eventDetails,
        eventId: eventId
      };

      this.http.put(BACKEND_URL + eventId, eventData)
        .subscribe(responseData => {
          console.log(responseData);
      });
  }

  getEvent(id: string) {
    return this.http.get<GameEvent>(BACKEND_URL + id)
      .subscribe(event => {
        this.event = event;
        this.eventUpdated.next(this.event);
      })
  }

  joinEvent(id: string) {
    this.http.get<any>(BACKEND_URL + id + '/join')
      .subscribe(response => {
        this.getEvent(id);
      });
  }

  leaveEvent(id:string) {
    this.http.get<any>(BACKEND_URL + id + '/leave')
      .subscribe(response => {
        this.getEvent(id);
      });
  }

  getEvents(lat: number, lng: number) {
    const url = BACKEND_URL + `?lat=${lat}&lng=${lng}`;
    return this.http.get<GameEvent[]>(url)
      .subscribe(events => {
        this.events = events;
        this.eventsUpdated.next([...this.events]);
      });
  }

  getEventsUpdateListener() {
    return this.eventsUpdated.asObservable();
  }

  getEventUpdateListener() {
    return this.eventUpdated.asObservable();
  }

}
