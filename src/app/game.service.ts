import { Injectable } from '@angular/core';
import { Game } from './models/game.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private games: Game[] = [];
  private gameUpdated = new Subject<Game[]>();

  constructor(private http: HttpClient,
              private router: Router) {
  }

  getGameUpdateListener() {
    return this.gameUpdated.asObservable();
  }

  getGames() {
    return this.http.get<Game[]>(BACKEND_URL + "games/")
      .subscribe(games => {
        this.games = games;
        console.log(games);
        this.gameUpdated.next([...this.games]);
      });
  }

  getGame(id: string) {
    return this.http.get<Game>(BACKEND_URL + "games/" + id);
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

    this.http.post<Game>(BACKEND_URL + "games/", gameData)
      .subscribe(responseData => {
        this.router.navigate(['game', responseData._id]);
      })
  }
}
