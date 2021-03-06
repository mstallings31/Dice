import { Injectable } from '@angular/core';
import { Game } from '../models/game.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';

const BACKEND_URL = environment.apiUrl + 'games/';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private games: Game[] = [];
  private gameUpdated = new Subject<Game[]>();
  private gameTitles: Game[] = [];

  constructor(private http: HttpClient,
              private router: Router) {
  }

  getGameUpdateListener() {
    return this.gameUpdated.asObservable();
  }

  getGames() {
    return this.http.get<Game[]>(BACKEND_URL)
      .subscribe(games => {
        this.games = games.sort((a, b) => (a.currentEvents.length < b.currentEvents.length) ? 1 : -1);
        this.gameUpdated.next([...this.games]);
      });
  }

  getGameTitles(): Observable<Game[]> {
    return this.http.get<Game[]>(BACKEND_URL + 'titles');
  }


  getGame(id: string, details: boolean) {
    const url = BACKEND_URL + id + (details ? "?details=true" : "");
    return this.http.get<Game>(url);
  }

  addGame(title: string,
          introText: string,
          description: string,
          minPlayers: string,
          maxPlayers: string,
          genre: string,
          minAge: string,
          minPlaytime: string,
          maxPlaytime: string,
          image: File) {
    const gameData = new FormData();
    gameData.append("title", title);
    gameData.append("introText", introText);
    gameData.append("description", description);
    gameData.append("minPlayers", minPlayers);
    gameData.append("maxPlayers", maxPlayers);
    gameData.append("genre", genre);
    gameData.append("minAge", minAge);
    gameData.append("minPlaytime", minPlaytime);
    gameData.append("maxPlaytime", maxPlaytime);
    gameData.append("image", image, title);

    this.http.post<Game>(BACKEND_URL, gameData)
      .subscribe(responseData => {
        this.router.navigate(['game', responseData._id]);
      })
  }

  updateGame(
    _id: string,
    title: string,
    introText: string,
    description: string,
    minPlayers: string,
    maxPlayers: string,
    genre: string,
    minAge: string,
    minPlaytime: string,
    maxPlaytime: string,
    image: File | string) {

    let gameData: Game | FormData;
    if (typeof image === "object") {
      gameData = new FormData();
      gameData.append('_id', _id);
      gameData.append("title", title);
      gameData.append("introText", introText);
      gameData.append("description", description);
      gameData.append("minPlayers", minPlayers);
      gameData.append("maxPlayers", maxPlayers);
      gameData.append("genre", genre);
      gameData.append("minAge", minAge);
      gameData.append("minPlaytime", minPlaytime);
      gameData.append("maxPlaytime", maxPlaytime);
      gameData.append("image", image, title);
    } else {
      gameData = new Game({
        _id: _id,
        title: title,
        introText: introText,
        description: description,
        minPlayers: +minPlayers,
        maxPlayers: +maxPlayers,
        genre: genre,
        minAge: +minAge,
        minPlaytime: +minPlaytime,
        maxPlaytime: +maxPlaytime,
        imagePath: image
      });
    }
    this.http.put<{ message: string }>(BACKEND_URL + _id, gameData)
      .subscribe(response => {
        this.router.navigate(['game', _id]);
      }, error => {
        console.log(error);
      })
  }
}
