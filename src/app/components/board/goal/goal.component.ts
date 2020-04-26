import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Player } from 'src/app/models/player.model';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss']
})
export class GoalComponent implements OnInit {

  myPlayer$: Observable<Player>;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
    // this.cardForm = this.modelCreate();
    const myId = this.authService.getUserId();
    const key = this.route.snapshot.params['id'];
    this.myPlayer$ = this.firebaseService.getGame(key).pipe(
      filter(g => g != null),
      // tap(g => this.gameService.setFreshGame(g)),
      map(g => g.players),
      filter(p => p != null),
      map(players => players?.find(p => p.id === myId)),
    );
  }
}
