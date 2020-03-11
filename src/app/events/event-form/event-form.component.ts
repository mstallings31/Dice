import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  form: FormGroup;

  constructor() { }

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
    const date = new Date(this.form.value.date);
    console.log(date.getMonth());
    console.log(date.getFullYear());
    console.log(date.getTime());
    console.log(date.toDateString());
    console.log(date.toISOString());
  }
}
