import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Game } from '../models/game.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.css']
})
export class GameFormComponent implements OnInit {
  private isEditMode: boolean = false;
  private gameId: string;
  private isLoading: boolean = false;
  game: Game;
  form: FormGroup;

  constructor(private gameService: GameService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Create form
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required]}),
      introText: new FormControl(null, {validators: [Validators.required]}),
      description: new FormControl(null, {validators: [Validators.required]}),
      imagePath: new FormControl(null, {validators: [Validators.required]}),
      minPlayers: new FormControl(null, {validators: [Validators.required]}),
      maxPlayers: new FormControl(null, {validators: [Validators.required]}),
      genre: new FormControl(null, {validators: [Validators.required]}),
      minAge: new FormControl(null, {validators: [Validators.required]}),
      minPlaytime: new FormControl(null, {validators: [Validators.required]}),
      maxPlaytime: new FormControl(null),
    });

    // Check parameters for id and determine if we are editing an
    // existing game or creating a new game
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('id')) {
        this.isEditMode = true;
        this.gameId = paramMap.get('id');
        // Eventually this will be updated to subscribe to observable
        // from api call
        this.game = this.gameService.getGame(this.gameId);
        this.form.setValue({
          title: this.game.title,
          introText: this.game.introText,
          description: this.game.description,
          imagePath: this.game.imagePath,
          minPlayers: this.game.minPlayers,
          maxPlayers: this.game.maxPlayers,
          genre: this.game.genre,
          minAge: this.game.minAge,
          minPlaytime: this.game.minPlaytime,
          maxPlaytime: this.game.maxPlaytime,
        });
      } else {
        this.isEditMode = false;
        this.gameId = null;
      }
    });
  }

}
