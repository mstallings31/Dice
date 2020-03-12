import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameEvent } from 'src/app/models/gameEvent.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  @Input() events: GameEvent;
  @Output() eventSelected = new EventEmitter<GameEvent>();
  constructor() { }

  ngOnInit(): void {
  }

  onEventSelected(event: GameEvent) {
    this.eventSelected.emit(event);
  }
}
