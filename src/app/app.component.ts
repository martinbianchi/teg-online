import { Component, OnInit } from '@angular/core';
import { GameService } from './services/game.service';
import { TurnService } from './services/turn.service';
import { DUMMY_PLAYERS } from './constants/players.constants';
import { Observable } from 'rxjs';
import { Game } from './models/game.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  game$: Observable<Game> = this.gameService.game$;

  constructor(
    private gameService: GameService,
    private turnService: TurnService
  ) { }

  ngOnInit(): void {
    localStorage.setItem('my_id', '1');
    const players = DUMMY_PLAYERS;
    this.gameService.newGame(players);
  }
}
