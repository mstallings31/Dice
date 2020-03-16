import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventService } from '../event.service';
import { ActivatedRoute } from '@angular/router';
import { GameEvent } from 'src/app/models/gameEvent.model';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/game.service';
import { Game } from 'src/app/models/game.model';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit, OnDestroy {
  public isEditMode: boolean = false;
  private eventId: string;
  form: FormGroup;
  gameId: string;
  gameTitle: string;
  event: GameEvent;
  eventSubscription: Subscription;
  isLoading: boolean = false;
  game: Game;

  constructor(private eventService: EventService,
              private activatedRoute: ActivatedRoute,
              private gameService: GameService) { }


  ngOnInit(): void {
    this.form = new FormGroup({

      streetAddress: new FormControl(null, { validators: [Validators.required] }),
      city: new FormControl(null, { validators: [Validators.required] }),
      state: new FormControl(null, { validators: [Validators.required] }),
      zipCode: new FormControl(null, { validators: [Validators.required] }),
      date: new FormControl(null, { validators: [Validators.required] }),
      eventDetails: new FormControl(null, { validators: [Validators.required] }),
    });

    this.gameId = this.activatedRoute.snapshot.params['gameId'];
    this.eventId = this.activatedRoute.snapshot.params['eventId'];
    if(this.gameId){
      // This is a new game
      this.isEditMode = false;
      this.eventId = null;
      this.gameService.getGame(this.gameId, true)
      .subscribe(game => {
          this.game = game;
          this.isLoading = false;
        }
      );
    }  else if (this.eventId) {
      // We are editing an existing game
      this.isEditMode = true;
      this.eventService.getEvent(this.eventId);
    }

    this.eventSubscription = this.eventService.getEventUpdateListener()
      .subscribe(returnedEvent => {
        this.event = returnedEvent;
        this.gameId = returnedEvent.gameId._id;
        const dateValue = this.parseDate(new Date(returnedEvent.date));
        this.form.patchValue({
          streetAddress: this.event.streetAddress,
          city: this.event.city,
          state: this.event.state,
          zipCode: this.event.zipCode,
          date: dateValue,
          eventDetails: this.event.eventDetails
        });
      });
  }

  onSaveEvent() {
    if (!this.form.valid) {
      return;
    }
    const isoDate = new Date(this.form.value.date).toISOString();
    if(this.isEditMode) {
      // Updating an existing event
      this.eventService.updateEvent(
        this.gameId,
        this.form.value.streetAddress,
        this.form.value.city,
        this.form.value.state,
        this.form.value.zipCode,
        isoDate,
        this.form.value.eventDetails,
        this.eventId
      );
    } else {
      // This is a new event
      this.eventService.addEvent(
        this.gameId,
        this.form.value.streetAddress,
        this.form.value.city,
        this.form.value.state,
        this.form.value.zipCode,
        isoDate,
        this.form.value.eventDetails
      );
    }
  }

  parseDate(date: Date) {
    let localDate = date.toLocaleDateString().split('/');
    let parseDate = localDate[2] + '-' +
      (+localDate[0] < 10 ? '0' + localDate[0] : localDate[0]) + '-' +
      (+localDate[1] < 10 ? '0' + localDate[1] : localDate[1]) + 'T';
    let localTime = date.toLocaleTimeString().split(":");
    let parseTime = (+localTime[0] < 10 ? '0' + localTime[0] : localTime[0]) + ":" + localTime[1];
    return parseDate + parseTime;
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }
}
