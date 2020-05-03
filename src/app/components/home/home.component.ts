import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { GameService } from 'src/app/services/game.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DUMMY_PLAYERS } from 'src/app/constants/players.constants';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Player } from 'src/app/models/player.model';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  games$ = this.firebaseService.getAllGames().pipe(
    map(g => g.map(game => ({
      key: game.key,
      ...game.payload.val() as any
    })))
  );
  user$ = this.authService.userLogged$;

  newGameForm: FormGroup;

  get color() { return this.newGameForm.get('color'); }
  get name() { return this.newGameForm.get('name'); }
  get nickname() { return this.newGameForm.get('nickname'); }

  constructor(
    private firebaseService: FirebaseService,
    private gameService: GameService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.newGameForm = this.modelCreate();
  }

  modelCreate = () => {
    return this.fb.group({
      name: ['', Validators.required],
      nickname: ['', Validators.required],
      color: ['red'],
    })
  }

  onNewGame = () => {
    if (!this.newGameForm.valid) {
      return;
    }

    const userId = this.authService.getUserId();
    const player: Player = {
      cards: [],
      color: this.color.value,
      countries: [],
      goal: null,
      id: userId,
      name: this.nickname.value,
      requiredCountriesToGetCard: null,
      swaps: null,
      continentCards: [],
      continentUsedCards: {
        afrika: false,
        asia: false,
        centralamerica: false,
        europe: false,
        northamerica: false,
        oceania: false,
        southamerica: false,
      }
    };

    localStorage.setItem('my_id', userId);

    // const players = DUMMY_PLAYERS;
    const key = this.gameService.initGame(this.name.value, player);

    this.goToGame(key);
  }

  goToGame = (key) => {
    localStorage.setItem('game_key', key);
    // this.firebaseService.setGameListener(key);
    this.firebaseService.getGame(key).subscribe(game => {
      if (game.started) {
        this.router.navigate([key, 'board']);
      } else {
        this.router.navigate([key, 'lobby']);
      }
    });
  }

  removeGames = () => this.firebaseService.removeList();
}
