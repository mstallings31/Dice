import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../game.service';
import { Subscription } from 'rxjs';
import { Game } from '../../models/game.model';

@Component({
  selector: 'app-game-search',
  templateUrl: './game-search.component.html',
  styleUrls: ['./game-search.component.css']
})
export class GameSearchComponent implements OnInit, OnDestroy {
  query: string = '';
  gameSub: Subscription;
  gamesList: Game[];
  filteredList: Game[];
  isLoading: boolean = false;


  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.getGames();
  }

  private getGames() {
    this.isLoading = true;
    this.gameSub = this.gameService
      .getGameTitles()
        .subscribe(games => {
          this.gamesList = games;
          this.gamesList.sort((a, b) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            if (titleA > titleB) { return 1 };
            if (titleA < titleB) { return -1 };
            return 0;
          });
        this.filteredList = this.gamesList;
        this.isLoading = false;
      },
      error => {
        console.log(error);
      });
  }

  searchGames() {
    this.filteredList = this.gamesList.filter(item => {
      return item.title.toLowerCase().includes(this.query.toLowerCase());
    });
  }

  resetQuery() {
    this.query = '';
    this.filteredList = this.gamesList;
  }

  ngOnDestroy() {
    this.gameSub.unsubscribe();
  }
}
