import { Injectable } from '@angular/core';
import { Game } from './models/game.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class GameService {
  games: Game[] = [];

  constructor(private http: HttpClient,
              private router: Router) {
  }

  getGames(): Game[] {
    return [...this.games];
  }

  getGame(id: string) {
    return this.http.get<Game>(BACKEND_URL + "games/" + id);
  }

  addGame(newGame: Game) {
    this.http.post<Game>(BACKEND_URL + "games/", newGame)
      .subscribe(responseData => {
        this.router.navigate(['game', responseData._id]);
      })
  }
}
