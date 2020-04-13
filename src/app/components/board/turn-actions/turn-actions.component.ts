import { Component, OnInit, Input } from '@angular/core';
import { TurnService } from 'src/app/services/turn.service';
import { GameService } from 'src/app/services/game.service';
import { tap } from 'rxjs/operators';
import { Round } from 'src/app/models/round.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-turn-actions',
  templateUrl: './turn-actions.component.html',
  styleUrls: ['./turn-actions.component.scss']
})
export class TurnActionsComponent implements OnInit {

  @Input() selectedOne;
  @Input() selectedTwo;

  round$: Observable<Round>;

  isYourTurn: boolean;

  constructor(
    private turnService: TurnService,
    private gameService: GameService
  ) { }

  ngOnInit(): void {
    this.round$ = this.gameService.round$.pipe(
      tap(this.evaluateTurn)
    );
  }

  evaluateTurn = (round: Round) => {
    this.isYourTurn = round.turn.player.id === this.getMyId();
  }

  getMyId = () => {
    return localStorage.getItem('my_id');
  }

  addArmies = () => {
    this.turnService.addArmies(this.selectedOne, 1);
  }

  attackCountries = () => {
    this.turnService.attackCountry(this.selectedOne, this.selectedTwo);
  }

  moveArmies = () => {
    this.turnService.moveArmies(this.selectedOne, this.selectedTwo, 1);
  }

  finishTurn = () => {
    this.gameService.finishTurn();
  }

  getCard = () => {
    this.turnService.getCard();
  }


}
