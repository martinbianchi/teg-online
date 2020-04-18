import { Component, OnInit, Input } from '@angular/core';
import { TurnService } from 'src/app/services/turn.service';
import { GameService } from 'src/app/services/game.service';
import { tap, map } from 'rxjs/operators';
import { Round } from 'src/app/models/round.model';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthService } from 'src/app/services/auth.service';

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
    private gameService: GameService,
    private firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const key = this.activatedRoute.snapshot.params['id'];
    this.round$ = this.firebaseService.getGame(key).pipe(
      // tap(g => this.gameService.setFreshGame(g)),
      map(game => game.round),
      tap(this.evaluateTurn)
    );
  }

  evaluateTurn = (round: Round) => {
    this.isYourTurn = round.turn.player.id === this.getMyId();
  }

  getMyId = () => {
    return this.authService.getUserId();
  }

  addArmies = () => {
    this.turnService.addArmies(this.selectedOne, 1);
  }

  attackCountries = () => {
    const attackResult = this.turnService.attackCountry(this.selectedOne, this.selectedTwo);
    let quantityArmies = 1;
    if (attackResult.conquered) {
      // TODO: ask for armies to pass
      do {
        quantityArmies = +prompt("How many armies do you want to move?", "Move armies");
      } while (quantityArmies <= 0 || quantityArmies > 3);

    }
    this.gameService.updateAfterAttack(this.selectedOne, this.selectedTwo, attackResult, quantityArmies);
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
