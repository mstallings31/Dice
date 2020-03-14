import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

interface ResponseData {
  results: [
    {
      geometry: {
        location: {
          lat: number,
          lng: number
        }
      }
    }
  ]
}

@Injectable({
  providedIn: 'root'
})
export class GoogleGeocodeService {

  constructor(private http: HttpClient) { }

  public translateCoordinates(address: string) {
    const url: string = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${environment.googleAPIKey}`;
    return this.http
      .get<ResponseData>(url)
      .pipe(map((returnedData) => {
        const coordinate = {
          lat: returnedData.results[0].geometry.location.lat,
          lng: returnedData.results[0].geometry.location.lng
        };
        return coordinate;
      }));
  }
}
