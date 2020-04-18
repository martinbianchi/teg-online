import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { GameService } from 'src/app/services/game.service';
import { DUMMY_PLAYERS } from 'src/app/constants/players.constants';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { map, tap } from 'rxjs/operators';
import { Player } from 'src/app/models/player.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Game } from 'src/app/models/game.model';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  game$: Observable<Game>;
  user$ = this.authService.userLogged$;

  connectedPlayers: Player[];
  colorsInUse: string[];

  joinGameForm: FormGroup;

  get color() { return this.joinGameForm.get('color'); }
  get nickname() { return this.joinGameForm.get('nickname'); }

  constructor(
    private firebaseService: FirebaseService,
    private gameService: GameService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) { }

  get userJoined() {
    const id = this.authService.getUserId();
    return this.connectedPlayers.map(p => p.id).includes(id);
  }


  ngOnInit(): void {
    this.joinGameForm = this.modelCreate();
    const key = this.route.snapshot.params['id'];
    this.game$ = this.firebaseService.getGame(key).pipe(
      // tap(g => this.gameService.setFreshGame(g)),
      tap(g => this.connectedPlayers = g.players),
      tap((g) => this.colorsInUse = g.players.map(c => c.color))
    );
  }

  modelCreate = () => {
    return this.fb.group({
      nickname: ['', Validators.required],
      color: ['', Validators.required],
    });
  }

  onJoinGame = () => {
    if (!this.joinGameForm.valid) {
      return;
    }
    const player: Player = {
      cards: [],
      color: this.color.value,
      countries: [],
      goal: null,
      id: this.authService.getUserId(),
      name: this.nickname.value,
      requiredCountriesToGetCard: null,
      swaps: null
    };

    this.gameService.joinGame(player);
  }

  // onNewGame = () => {

  //   localStorage.setItem('my_id', '1');
  //   const players = DUMMY_PLAYERS;
  //   this.gameService.newGame(players);
  // }

  goToGame = (key) => {
    localStorage.setItem('game_key', key);
    // this.firebaseService.setGameListener(key);np
    this.router.navigate(['board']);
  }

  onInitGame = () => {
    this.gameService.newGame();
    this.router.navigate(['../board'], { relativeTo: this.route });
  }

}
