import { GameEvent } from './gameEvent.model';

export class Game {
  _id: string;
  title: string;
  introText: string;
  description: string;
  imagePath: string;
  minPlayers: number;
  maxPlayers: number;
  genre: string;
  minAge: number;
  minPlaytime: number;
  maxPlaytime: number;
  currentEvents: [GameEvent]


  constructor(init?: Partial<Game>) {
    Object.assign(this, init);
  }
}
