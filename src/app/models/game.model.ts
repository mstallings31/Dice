export interface Game {
  id: string;
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
}
