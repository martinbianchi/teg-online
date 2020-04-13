import { Injectable } from '@angular/core';
import { Game } from '../models/game.model';
import { AngularFireDatabase } from '@angular/fire/database/database';

@Injectable({ providedIn: 'root' })
export class FirebaseService {

    game$;

    constructor(
        private db: AngularFireDatabase
    ) {
        this.game$ = db.list('game').valueChanges();
    }

    updateGame = (game: Game) => {
        const itemRef = this.db.object('game');
        itemRef.set(game);
    }

    setGameListener = (gameId) => { }
}