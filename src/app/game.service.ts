import { Injectable } from '@angular/core';
import { Game } from './models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  games: Game[] = [];

  constructor() {
    this.games.push({
      id: "1",
      title: "Tiny Epic Quest",
      introText: "Tiny epic Quest is a strategy game that is set in a classic fantasy world, Perfect for 1-4 players that is easy to learn and is popular with adults, kids, teens, families, and everyone",
      description: "A world of peace has been torn asunder by the opening of a vile portal from the goblin kingdom. Nasty goblins pour into the peaceful groves and villages of the elf world, setting the realm ablaze. Now you, the heroes, must quest in order to right this wrong. There are two paths to victory: closing the portal or slaying all the goblins. Which one will you choose? Either way, your quests will be aided by the help of the surviving mushroom folk — and by the epic items that have been lost in the realm's deep dungeons. The world is ending quickly, so you must act fast to save it, but you also need to know when your luck will run out...",
      imagePath: "assets/images/tinyepicquest.jpeg",
      minPlayers: 1,
      maxPlayers: 4,
      genre: "Board Game",
      minAge: 14,
      minPlaytime: 30,
      maxPlaytime: 90
    });
    this.games.push({
      id: "2",
      title: "Mysterium",
      introText: "A horrible crime has been committed on the grounds of Warwick Manor and it's up to the psychic investigators to get to the bottom of it.",
      description: "In the 1920s, Mr. MacDowell, a gifted astrologer, immediately detected a supernatural being upon entering his new house in Scotland. He gathered eminent mediums of his time for an extraordinary séance, and they have seven hours to make contact with the ghost and investigate any clues that it can provide to unlock an old mystery.",
      imagePath: "assets/images/mysterium.jpg",
      minPlayers: 2,
      maxPlayers: 7,
      genre: "Board Game",
      minAge: 10,
      minPlaytime: 42,
      maxPlaytime: 42
    });
  }

  getGames(): Game[] {
    return [...this.games];
  }

  getGame(id: string): Game {
    return this.games.find(element => id === element.id);
  }
}
