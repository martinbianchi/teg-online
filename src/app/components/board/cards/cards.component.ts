import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Observable } from 'rxjs';
import { Player } from 'src/app/models/player.model';
import { map, tap, filter } from 'rxjs/operators';
import { TurnService } from 'src/app/services/turn.service';
import { Card } from 'src/app/models/card.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SwapService } from 'src/app/services/swap.service';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  myPlayer$: Observable<Player>;
  cardForm: FormGroup;

  cards: Card[];

  constructor(
    private gameService: GameService,
    private turnService: TurnService,
    private swapService: SwapService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.cardForm = this.modelCreate();
    const myId = this.authService.getUserId();
    const key = this.route.snapshot.params['id'];
    this.myPlayer$ = this.firebaseService.getGame(key).pipe(
      filter(g => g != null),
      // tap(g => this.gameService.setFreshGame(g)),
      map(g => g.players),
      filter(p => p != null),
      map(players => players?.find(p => p.id === myId)),
      tap((player) => {
        this.cardForm?.reset();
        this.cards = player?.cards ? player.cards : [];
      })
    );
  }

  modelCreate = () => {
    return this.fb.group({
      firstCard: [],
      secondCard: [],
      thirdCard: [],
      fourthCard: [],
      fifthCard: []
    });
  }

  onUseCard = (card: Card) => {
    this.turnService.useCard(card);
  }

  onSwap = () => {
    const cards = [];
    Object.values(this.cardForm.value).forEach((selected, i) => {
      if (selected) {
        cards.push(this.cards[i]);
      }
    });

    const validSwap = this.swapService.validSwap(cards);

    if (validSwap) {
      this.turnService.makeSwap(cards);
    }
  }

}
