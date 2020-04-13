import { Injectable } from '@angular/core';
import { Game } from '../models/game.model';
import { AttackResult } from '../models/attack-result.model';
import { Country } from '../models/country.model';

import * as _ from 'lodash';
import { Player } from '../models/player.model';
import { BehaviorSubject } from 'rxjs';
import { COUNTRIES } from '../constants/countries.constants';
import { Round } from '../models/round.model';
import { map, first, tap } from 'rxjs/operators';
import { TurnService } from './turn.service';
import { FIRST_ROUND, SECOND_ROUND, THIRD_ROUND, CLASSIC_COMBAT } from '../constants/rounds.constants';
import { CARDS } from '../constants/cards.constants';
import { Turn } from '../models/turn.model';
import { ArmiesToAdd } from '../models/armies-to-add.model';
import { RoundType } from '../models/round-type.model';
import { Card } from '../models/card.model';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class GameService {

    private _game: Game;
    game$ = this.firebaseService.game$.pipe(
        tap((game: Game) => this._game = game)
    );

    private _rounds: BehaviorSubject<Round[]> = new BehaviorSubject([]);
    round$ = this._rounds.asObservable().pipe(map(r => r[r.length - 1]));

    playersOrder: Player[];

    constructor(
        private firebaseService: FirebaseService
    ) { }

    getNextRound = () => {
        const rounds = this._rounds.getValue();
        const lastRound = rounds[rounds.length - 1];
        let round: Round;
        const firstPlayer = this.getPlayer(this.playersOrder[0].id);
        if (lastRound.roundType.isFirst) {
            round = SECOND_ROUND;
            round.turn.player = firstPlayer;
        }

        else if (lastRound.roundType.isSecond) {
            round = THIRD_ROUND;
            round.turn.player = firstPlayer;
        } else {
            round = CLASSIC_COMBAT;
            round.turn.player = firstPlayer;
            round.number = lastRound.number + 1;
        }

        round.turn.armiesToAdd = this.calculateArmiesToAdd(firstPlayer, round.roundType);

        return this._rounds.next([
            ...this._rounds.getValue(),
            round
        ]);
    }

    finishTurn = () => {
        const rounds = this._rounds.getValue();
        const actualRound = rounds[rounds.length - 1];

        if (this.isLastTurnOfRound(actualRound.turn.player)) {
            this.getNextRound();
        } else {
            this.advanceTurnInRound(actualRound);
        }
    }

    advanceTurnInRound = (actualRound: Round) => {
        const actualIdxPlayer = this.playersOrder.findIndex(p => p.id === actualRound.turn.player.id);
        const roundWithUpdatedTurn = _.cloneDeep(actualRound);
        const playerTurn = this.getPlayer(this.playersOrder[actualIdxPlayer + 1].id);
        const armiesToAdd = this.calculateArmiesToAdd(playerTurn, actualRound.roundType);

        let armiesAdded = false;
        if (actualRound.roundType.isThird) {
            armiesAdded = true;
        }

        const turn: Turn = {
            armiesAdded,
            armiesToAdd,
            attacked: false,
            getCard: false,
            player: playerTurn,
            regrouped: false,
            conqueredCountries: 0
        };

        roundWithUpdatedTurn.turn = turn;
        this._rounds.next([
            ...this._rounds.getValue(),
            roundWithUpdatedTurn
        ]);
    }

    calculateArmiesToAdd = (player: Player, roundType: RoundType): ArmiesToAdd => {
        let generalArmiesToAdd;
        if (roundType.isFirst) {
            generalArmiesToAdd = 8;
        } else if (roundType.isSecond) {
            generalArmiesToAdd = 5;
        } else if (roundType.isThird) {
            generalArmiesToAdd = 0;
        } else {
            generalArmiesToAdd = Math.trunc(_.divide(player.countries.length, 2));
        }

        const result = {
            afrika: 0,
            asia: 0,
            centralAmerica: 0,
            europe: 0,
            general: generalArmiesToAdd,
            northAmerica: 0,
            oceania: 0,
            southAmerica: 0,
        };
        return result;
    }

    isLastTurnOfRound = (player: Player) => {
        const idxPlayer = this.playersOrder.findIndex(p => p.id === player.id);
        return idxPlayer === (this.playersOrder.length - 1);
    }

    newGame = (players: Player[]) => {
        // const countries = _.shuffle(_.cloneDeep(COUNTRIES));
        const countries = _.cloneDeep(COUNTRIES);
        const countriesPerPlayer = Math.trunc(_.divide(countries.length, players.length));
        const cardsDeck: Card[] = _.shuffle(CARDS).map(c => ({
            country: c.name,
            symbol: c.symbol,
            used: false
        }));

        const chunkedCountries = _.chunk(countries, countriesPerPlayer);
        this.playersOrder = _.shuffle(players);
        players.forEach((p, index) => {
            p.countries = chunkedCountries[index].map(c => ({
                armies: 1,
                name: c.name,
                continent: c.continent,
                ownerId: p.id,
                rockets: 0,
                borderingCountries: c.borderingCountries
            }));
        });

        const firstRound = FIRST_ROUND;
        firstRound.turn.player = this.playersOrder[0];
        this._rounds.next([
            firstRound
        ]);

        this.updateGame({
            cardsDeck,
            players,
            roundCondition: null,
            roundNumber: 0
        });

    }

    updateAfterAttack = (attacker: Country, defender: Country, attackResult: AttackResult) => {
        const attackerPlayerIdx = this.getPlayerIndex(attacker.ownerId);
        const defenderPlayerIdx = this.getPlayerIndex(defender.ownerId);

        const updatedPlayers = _.cloneDeep(this._game.getValue().players);

        const attackerPlayer = updatedPlayers[attackerPlayerIdx];
        const defenderPlayer = updatedPlayers[defenderPlayerIdx];

        const countryAttackerIdx = attackerPlayer.countries.findIndex(c => c.name === attacker.name);
        attackerPlayer.countries[countryAttackerIdx].armies -= attackResult.attackerLostArmies;

        if (attackResult.conquered) {
            defenderPlayer.countries = defenderPlayer.countries.filter(c => c.name !== defender.name);
            attackerPlayer.countries.push({
                armies: 1,
                name: defender.name,
                continent: defender.continent,
                ownerId: attackerPlayer.id,
                rockets: 0,
                borderingCountries: defender.borderingCountries
            });
        } else {
            const countryDefenderIdx = defenderPlayer.countries.findIndex(c => c.name === defender.name);
            defenderPlayer.countries[countryDefenderIdx].armies -= attackResult.defenderLostArmies;
        }

        this._game.next({
            ..._.cloneDeep(this._game.getValue()),
            players: updatedPlayers,
        });
    }

    updatePlayer = (player: Player) => {
        const players = this._game.getValue().players;
        const playerIdx = players.findIndex(p => p.id === player.id);

        players[playerIdx] = player;

        this._game.next({
            ...this._game.getValue(),
            players
        });
    }

    updateCountry = (country: Country) => {
        const updatedPlayers = _.cloneDeep(this._game.getValue().players);
        const playerOwnerIdx = updatedPlayers.findIndex(p => p.id === country.ownerId);

        const countryIdx = updatedPlayers[playerOwnerIdx].countries.findIndex(c => c.name === country.name);
        updatedPlayers[playerOwnerIdx].countries[countryIdx] = country;

        this._game.next({
            ...this._game.getValue(),
            players: updatedPlayers
        });
    }

    getPlayer = playerId => {
        return _.cloneDeep(this._game.getValue().players.find(p => p.id === playerId));
    }

    getCountry = (countryName: string): Country => {
        let country;
        this._game.getValue().players.forEach(p => {
            const idx = p.countries.findIndex(c => c.name === countryName);
            if (idx !== -1) {
                country = p.countries[idx];
            }
        });

        return _.cloneDeep(country);
    }

    getCurrentTurn = (): Turn => {
        const rounds = this._rounds.getValue();
        const actualRound = rounds[rounds.length - 1];
        return _.cloneDeep(actualRound.turn);
    }

    updateTurn = (turn: Turn) => {
        const rounds = this._rounds.getValue();
        const actualRound = _.cloneDeep(rounds[rounds.length - 1]);
        actualRound.turn = turn;
        this._rounds.next([
            ...this._rounds.getValue(),
            actualRound
        ]);
    }

    getNextCard = () => {
        const deck = _.cloneDeep(this._game.getValue().cardsDeck);
        const card = deck.pop();

        let updatedDeck = deck;
        if (deck.length === 0) {
            updatedDeck = _.shuffle(CARDS).map(c => ({
                country: c.name,
                symbol: c.symbol,
                used: false
            }));
        }

        this._game.next({
            ...this._game.getValue(),
            cardsDeck: updatedDeck
        });

        return card;
    }

    private getPlayerIndex = (id: string) => this._game?.getValue().players?.findIndex(p => p.id === id);

    private updateGame = (game: Game) => this.firebaseService.updateGame(game);
}