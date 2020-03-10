export class Game {
  _id: string;
  title: string;
  introText: string;
  description: string;
  //imagePath: string;
  minPlayers: number;
  maxPlayers: number;
  genre: string;
  minAge: number;
  minPlaytime: number;
  maxPlaytime: number;

  constructor(init?: Partial<Game>) {
    Object.assign(this, init);
  }
}
