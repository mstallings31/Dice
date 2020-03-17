import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Game } from '../../models/game.model';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent implements OnInit {
  id: string;
  game: Game;
  isLoading = false;

  constructor(private gameService: GameService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.gameService.getGame(this.id, true)
        .subscribe(game => {
            this.game = game;
            this.isLoading = false;
          }
        );
      }
    );
  }

}
