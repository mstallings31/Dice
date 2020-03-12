import { Component, OnInit, Input } from '@angular/core';
import { GameEvent } from 'src/app/models/gameEvent.model';

@Component({
  selector: 'app-event-tile',
  templateUrl: './event-tile.component.html',
  styleUrls: ['./event-tile.component.css']
})
export class EventTileComponent implements OnInit {
  @Input() event: GameEvent;
  constructor() { }

  ngOnInit(): void {
  }

}
