import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameEvent } from 'src/app/models/gameEvent.model';
import { ActivatedRoute, Params } from '@angular/router';
import { EventService } from '../event.service';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit, OnDestroy {
  id: string;
  event: GameEvent;
  parsedDate: string;
  apiKey: string = environment.googleAPIKey;
  isLoading: boolean = false;
  eventSubscription: Subscription;
  isAttending: boolean = false;
  username: string;
  isHost = false;

  constructor(private eventService: EventService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.username = this.authService.getUsername();
    this.id = this.activatedRoute.snapshot.params['id'];
    this.eventService.getEvent(this.id);
    this.eventSubscription = this.eventService.getEventUpdateListener()
      .subscribe(returnedEvent => {
        this.event = returnedEvent;
        this.isHost = this.username === this.event.hostUsername;
        this.parsedDate = this.parseDate(new Date(returnedEvent.date));
        this.isLoading = false;
        this.isAttending = this.event.attendees.findIndex(x => x.username === this.username) !== -1;
      });
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
    this.eventService.joinEvent(this.id);
  };

  onLeave() {
    this.eventService.leaveEvent(this.id);
  }

  onDelete() {
    this.eventService.deleteEvent(this.id);
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }
}
