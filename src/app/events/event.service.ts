import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GoogleGeocodeService } from '../googleGeocode.service';

const BACKEND_URL = environment.apiUrl + 'events/';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient,
              private googleGeocodeService: GoogleGeocodeService) {}

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

    this.http.post(BACKEND_URL, eventData)
      .subscribe(responseData => {
        console.log(responseData);
    });
  }
}
