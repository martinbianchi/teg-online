import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dices',
  templateUrl: './dices.component.html',
  styleUrls: ['./dices.component.scss']
})
export class DicesComponent implements OnInit {

  attackerDices$: Observable<number[]>;
  defenderDices$: Observable<number[]>;

  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const gameId = this.route.snapshot.params['id'];
    this.attackerDices$ = this.firebaseService.getAttackDicesSubscription(gameId);
    this.defenderDices$ = this.firebaseService.getDefendDicesSubscription(gameId);
  }

}
