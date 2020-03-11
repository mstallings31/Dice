import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  form: FormGroup;
  gameId: string = "5e67f45861de1bcc128d5714";

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      streetAddress: new FormControl(null, { validators: [Validators.required] }),
      city: new FormControl(null, { validators: [Validators.required] }),
      state: new FormControl(null, { validators: [Validators.required] }),
      zipCode: new FormControl(null, { validators: [Validators.required] }),
      date: new FormControl(null, { validators: [Validators.required] }),
      eventDetails: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  onSaveEvent() {
    if (!this.form.valid) {
      return;
    }

    const isoDate = new Date(this.form.value.date).toISOString();
    console.log(isoDate);
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
