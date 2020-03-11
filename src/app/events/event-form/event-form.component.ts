import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventService } from '../event.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GameEvent } from 'src/app/models/gameEvent.model';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  public isEditMode: boolean = false;
  private eventId: string;
  form: FormGroup;
  gameId: string;
  event: GameEvent;

  constructor(private eventService: EventService,
              private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.form = new FormGroup({
      streetAddress: new FormControl(null, { validators: [Validators.required] }),
      city: new FormControl(null, { validators: [Validators.required] }),
      state: new FormControl(null, { validators: [Validators.required] }),
      zipCode: new FormControl(null, { validators: [Validators.required] }),
      date: new FormControl(null, { validators: [Validators.required] }),
      eventDetails: new FormControl(null, { validators: [Validators.required] }),
    });

    // Check parameters for id and determine if we are editing an
    // existing event or creating a new event
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('eventId')) {
        this.isEditMode = true;
        this.eventId = paramMap.get('eventId');

        this.eventService.getEvent(this.eventId)
          .subscribe(event => {
            this.event = event;
            this.gameId = event.gameId;
            const dateValue = this.parseDate(new Date(this.event.date));
            this.form.patchValue({
              streetAddress: this.event.streetAddress,
              city: this.event.city,
              state: this.event.state,
              zipCode: this.event.zipCode,
              date: dateValue,
              eventDetails: this.event.eventDetails
            });
          })
      } else {
        // We are creating a new event
        this.isEditMode = false;
        this.eventId = null;
        this.gameId = paramMap.get('gameId');
      }

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
    const year = date.getFullYear();
    const month =  ( date.getMonth() < 10) ? '0' + date.getMonth() : date.getMonth();
    const day = ( date.getDay() < 10 ) ? '0' + date.getDay() : date.getDay();
    const hour = ( date.getHours() < 10 ) ? '0' + date.getHours() : date.getHours();
    const minutes = ( date.getMinutes() < 10 ) ? '0' + date.getMinutes() : date.getMinutes();
    return year + "-" + month + "-" + day + "T" + hour + ":" + minutes;
  }
}
