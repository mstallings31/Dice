import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleGeocodeService {

  constructor(private http: HttpClient) { }

  public translateCoordinates(address: string) {
    const url: string = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${environment.googleAPIKey}`;
    // return this.http
    //   .get(url)
    //   .pipe(map((returnedData) => {
    //     const coordinate = {
    //       latitude: returnedData.results[0].geometry.location.lat,
    //       longitude: returnedData.results[0].geometry.location.lng
    //     };
    //     return coordinate;
    //   }));
      return this.http
      .get(url).subscribe(response => {
        console.log(response);
      });
  }
}
