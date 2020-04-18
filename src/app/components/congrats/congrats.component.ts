import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from 'src/app/models/player.model';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-congrats',
  templateUrl: './congrats.component.html',
  styleUrls: ['./congrats.component.scss']
})
export class CongratsComponent implements OnInit {

  winner: Player;

  constructor(
    private firebaseService: FirebaseService,
  ) { }

  ngOnInit(): void {
    this.winner = this.firebaseService._game.winner;
  }

}
