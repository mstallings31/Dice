import { Component, OnInit, OnDestroy } from '@angular/core';
import { Game } from '../models/game.model';
import { GameService } from '../game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, OnDestroy {
  games: Game[];
  gameSubscription: Subscription;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.getGames();
    this.gameSubscription = this.gameService.getGameUpdateListener()
      .subscribe((gameData: Game[]) => {
        this.games = gameData;
      });
  }

  ngOnDestroy() {
    this.gameSubscription.unsubscribe();
  }

}
