import { Injectable } from '@angular/core';
import { Game } from '../models/game.model';
import { Observable, of } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { tap, shareReplay } from 'rxjs/operators';
import { Round } from '../models/round.model';
import { Player } from '../models/player.model';

@Injectable({ providedIn: 'root' })
export class FirebaseService {

    _game: Game;
    _round: Round;
    playersOrder: Player[];
    constructor(
        private db: AngularFireDatabase
    ) {

    }



    updateGame = (game: Game) => {
        const actualGame = localStorage.getItem('game_key');
        this.db.object('game/' + actualGame).set(game);
    }

    createGame = (game: Game) => {
        const itemRef = this.db.list('game');
        const ref = itemRef.push(game);
        return ref.key;
    }

    getAllGames = () => {
        return this.db.list('game').snapshotChanges().pipe(
        );
    }

    // setGameListener = (gameId) => {
    //     this.game$ = this.db.object<Game>('game/' + gameId).valueChanges().pipe(
    //         tap(console.log),
    //         shareReplay(),

    //     );
    // }

    getGame = (gameId) => {
        const itemRef = this.db.object<Game>('game/' + gameId).valueChanges().
            pipe(tap((game) => {
                this._game = game;
                this._round = game.round;
                this.playersOrder = game.playersOrder;
            }));
        return itemRef;
    }

    removeList = () => {
        const itemsRef = this.db.list('game');
        itemsRef.remove();
    }
}