import { Game } from './game.model';

export interface GameEvent {
  _id: string;
  hostId: {
      _id: string,
      username: string,
    }
  hostUsername: string;
  gameId: {
      _id: string,
      title: string,
      introText: string,
      description: string,
      minPlayers: number,
      maxPlayers: number,
      genre: string,
      minAge: number,
      minPlaytime: number,
      maxPlaytime: number,
      imagePath: string
    }
  date: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  eventDetails: string;
  coords: {
    type: { type: string },
    coordinates: [number, number]
  }
};
