import { NgModule } from '@angular/core';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { GameFormComponent } from './game-form/game-form.component';
import { ReadMoreComponent } from './game-detail/read-more/read-more.component';
import { GameSearchComponent } from './game-search/game-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HtmlLineBreaksPipe } from './html-line-breaks.pipe';
import { EllipsisPipe } from './ellipsis.pipe';
import { GameCardComponent } from './game-list/game-card/game-card.component';
import { GameListComponent } from './game-list/game-list.component';

@NgModule({
  declarations: [
    GameDetailComponent,
    GameFormComponent,
    ReadMoreComponent,
    GameCardComponent,
    GameListComponent,
    GameSearchComponent,
    HtmlLineBreaksPipe,
    EllipsisPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    HtmlLineBreaksPipe,
    EllipsisPipe
  ]
})
export class GamesModule {}
