import { Component, OnInit } from '@angular/core';
import { GameEvent } from 'src/app/models/gameEvent.model';
import { ActivatedRoute, Params } from '@angular/router';
import { EventService } from '../event.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  id: string;
  event: GameEvent;
  parsedDate: string;
  apiKey: string = environment.googleAPIKey;
  isLoading: boolean = false;

  constructor(private eventService: EventService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.eventService.getEvent(this.id)
          .subscribe(returnedEvent => {
            this.event = returnedEvent;
            this.parsedDate = this.parseDate(new Date(returnedEvent.date));
            this.isLoading = false;
          });
      }
    );
  }

  parseDate(date: Date): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const weekName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekDay = weekName[date.getDay()];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = ( date.getMinutes() < 10 ) ? '0' + date.getMinutes() : date.getMinutes();
    const timeString = ""+ hours + ((minutes === '00') ? "" : ":" + minutes) + ampm;
    return weekDay + ", " + month + " " + day + ", " + year + " at " + timeString;
  }

  onJoin() {
    this.eventService.joinEvent(this.id).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  };
}
