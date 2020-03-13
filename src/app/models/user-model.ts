import { GameEvent } from './gameEvent.model';

export interface User {
  email: string,
  username: string;
  events: [GameEvent]
};
