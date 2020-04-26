import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ArmiesToAdd } from 'src/app/models/armies-to-add.model';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-available-armies',
  templateUrl: './available-armies.component.html',
  styleUrls: ['./available-armies.component.scss']
})
export class AvailableArmiesComponent implements OnInit {

  playerTurnArmies$: Observable<ArmiesToAdd>;

  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const gameId = this.route.snapshot.params['id'];
    this.playerTurnArmies$ = this.firebaseService.getGame(gameId)
      .pipe(
        filter(g => g.started),
        map(g => g?.round?.turn?.armiesToAdd)
      );
  }

}
