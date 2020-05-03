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
    _gameId: string;

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
        this.createDicesChannel(ref.key);
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
        this._gameId = gameId;
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

    createDicesChannel = (gameId) => {
        const itemRef = this.db.object(`dices/${gameId}`);
        const dices = {
            attackDices: [],
            defendDices: [],
        };
        itemRef.set(dices);
    }

    getAttackDicesSubscription = gameId => {
        return this.db.object<number[]>(`dices/${gameId}/attackDices`).valueChanges();
    }

    getDefendDicesSubscription = gameId => {
        return this.db.object<number[]>(`dices/${gameId}/defendDices`).valueChanges();
    }

    pushAttackDices = (dices: number[]) => {
        const itemRef = this.db.object(`dices/${this._gameId}/attackDices`);
        setTimeout(() => {
            itemRef.set(dices);
        }, 1000);
    }

    pushDefendDices = (dices: number[]) => {
        const itemRef = this.db.object(`dices/${this._gameId}/defendDices`);
        setTimeout(() => {
            itemRef.set(dices);
        }, 1000);
    }

    resetDices = () => {
        const itemRef = this.db.object(`dices/${this._gameId}`);
        itemRef.set({ attackDices: [], defendDices: [] });
    }
}