import { Component, OnInit, Input } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Player } from 'src/app/models/player.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-turn-order',
  templateUrl: './turn-order.component.html',
  styleUrls: ['./turn-order.component.scss']
})
export class TurnOrderComponent implements OnInit {

  @Input() playersOrder: Player[];
  @Input() currentTurn: Player;

  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

}
