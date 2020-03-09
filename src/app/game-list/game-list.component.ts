import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {
  games: Game[];
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.games = this.gameService.getGames();
  }

}
