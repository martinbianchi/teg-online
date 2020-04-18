import { Injectable } from '@angular/core';
import { Game } from '../models/game.model';
import { AttackResult } from '../models/attack-result.model';
import { Country } from '../models/country.model';

import * as _ from 'lodash';
import { Player } from '../models/player.model';
import { COUNTRIES } from '../constants/countries.constants';
import { Round } from '../models/round.model';
import { FIRST_ROUND, SECOND_ROUND, THIRD_ROUND, CLASSIC_COMBAT } from '../constants/rounds.constants';
import { CARDS } from '../constants/cards.constants';
import { Turn } from '../models/turn.model';
import { ArmiesToAdd } from '../models/armies-to-add.model';
import { RoundType } from '../models/round-type.model';
import { Card } from '../models/card.model';
import { FirebaseService } from './firebase.service';
import { GoalService } from './goal.service';
import { GOALS } from '../constants/goals.constants';
import { DUMMY_PLAYERS } from '../constants/players.constants';

@Injectable({ providedIn: 'root' })
export class GameService {

    constructor(
        private firebaseService: FirebaseService,
        private goalService: GoalService
    ) { }

    initGame = (name: string, player: Player) => {
        const game: Game = {
            started: false,
            players: [player],
            cardsDeck: [],
            finished: false,
            playersOrder: [],
            roundCondition: null,
            roundNumber: null,
            round: null,
            winner: null,
            name
        };

        return this.firebaseService.createGame(game);
    }

    joinGame = (player: Player) => {
        this.firebaseService.updateGame({
            ...this.firebaseService._game,
            players: [
                ...this.firebaseService._game.players,
                player
            ]
        });
    }

    newGame = () => {
        const countries = _.shuffle(_.cloneDeep(COUNTRIES));
        const goals = _.shuffle(_.cloneDeep(GOALS));
        const players = _.cloneDeep(this.firebaseService._game.players);
        const countriesPerPlayer = Math.ceil(_.divide(countries.length, players.length));
        const cardsDeck: Card[] = _.shuffle(CARDS).map(c => ({
            country: c.name,
            symbol: c.symbol,
            used: false
        }));

        const chunkedCountries = _.chunk(countries, countriesPerPlayer);
        const playersOrder = _.shuffle(players);
        players.forEach((p, index) => {
            p.cards = [];
            p.goal = goals.pop(),
                p.requiredCountriesToGetCard = 1;
            p.swaps = 0;
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
        firstRound.turn.player = playersOrder[0];

        this.firebaseService.updateGame({
            ...this.firebaseService._game,
            cardsDeck,
            players,
            roundCondition: null,
            roundNumber: 0,
            round: firstRound,
            playersOrder,
            started: true,
            finished: false,
        });
    }

    getNextRound = () => {
        const lastRound = _.cloneDeep(this.firebaseService._round);
        let round: Round;
        const firstPlayer = this.getPlayer(this.firebaseService.playersOrder[0].id);
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

        this.updateGame({
            ...this.firebaseService._game,
            round
        });
    }

    finishTurn = () => {

        const actualRound = _.cloneDeep(this.firebaseService._round);

        const player = actualRound.turn.player;
        const hasWon = this.goalService.evaluateGoal(player);

        if (hasWon) {
            this.updateGame({
                ...this.firebaseService._game,
                finished: true,
                winner: player
            });
        } else {
            if (this.isLastTurnOfRound(actualRound.turn.player)) {
                this.getNextRound();
            } else {
                this.advanceTurnInRound(actualRound);
            }
        }

    }

    advanceTurnInRound = (actualRound: Round) => {
        const actualIdxPlayer = this.firebaseService.playersOrder.findIndex(p => p.id === actualRound.turn.player.id);
        const roundWithUpdatedTurn = _.cloneDeep(actualRound);
        const playerTurn = this.getPlayer(this.firebaseService.playersOrder[actualIdxPlayer + 1].id);
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
        this.updateGame({
            ...this.firebaseService._game,
            round: roundWithUpdatedTurn
        });

        // this.firebaseService._rounds.next([
        //     ...this.firebaseService._rounds.getValue(),
        //     roundWithUpdatedTurn
        // ]);
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
            generalArmiesToAdd = Math.max(Math.trunc(_.divide(player.countries.length, 2)), 4);
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
        const idxPlayer = this.firebaseService.playersOrder.findIndex(p => p.id === player.id);
        return idxPlayer === (this.firebaseService.playersOrder.length - 1);
    }



    updateAfterAttack = (attackerCountry: string, defenderCountry: string, attackResult: AttackResult, quantityArmies: number = 1) => {
        let updatedGame = _.cloneDeep(this.firebaseService._game);
        const updatedTurn = _.cloneDeep(this.getCurrentTurn());
        const attacker = this.getCountry(attackerCountry);
        const defender = this.getCountry(defenderCountry);

        const attackerPlayerIdx = this.getPlayerIndex(attacker.ownerId);
        const defenderPlayerIdx = this.getPlayerIndex(defender.ownerId);

        const updatedPlayers = _.cloneDeep(this.firebaseService._game.players);

        const attackerPlayer = updatedPlayers[attackerPlayerIdx];
        const defenderPlayer = updatedPlayers[defenderPlayerIdx];

        const countryAttackerIdx = attackerPlayer.countries.findIndex(c => c.name === attacker.name);
        attackerPlayer.countries[countryAttackerIdx].armies -= attackResult.attackerLostArmies;

        let updatedPlayersOrder = this.firebaseService.playersOrder;
        let winner = null;
        let won = false;
        if (attackResult.conquered) {
            updatedTurn.conqueredCountries += 1;
            defenderPlayer.countries = defenderPlayer.countries.filter(c => c.name !== defender.name);
            attackerPlayer.countries.push({
                armies: quantityArmies,
                name: defender.name,
                continent: defender.continent,
                ownerId: attackerPlayer.id,
                rockets: 0,
                borderingCountries: defender.borderingCountries
            });

            if (this.hasDetroyedPlayer(defenderPlayer)) {
                updatedPlayersOrder = this.firebaseService.playersOrder.filter(p => p.id !== defenderPlayer.id);
                if (defenderPlayer?.cards?.length > 0) {
                    attackerPlayer.cards = attackerPlayer.cards ? [
                        ...attackerPlayer.cards,
                        ...defenderPlayer.cards
                    ] : [...defenderPlayer.cards]
                }

                won = this.goalService.evaluateDestroyGoal(attackerPlayer, defenderPlayer.id);
                if (won) {
                    winner = _.cloneDeep(attackerPlayer);
                }
            }
        } else {
            const countryDefenderIdx = defenderPlayer.countries.findIndex(c => c.name === defender.name);
            defenderPlayer.countries[countryDefenderIdx].armies -= attackResult.defenderLostArmies;
        }

        updatedGame = this.updateTurn(updatedTurn, this.firebaseService._game);
        updatedGame.players = updatedPlayers;
        updatedGame.playersOrder = updatedPlayersOrder;
        updatedGame.finished = won;
        updatedGame.winner = winner;
        this.updateGame(updatedGame);
    }

    private hasDetroyedPlayer = (defenderPlayer: Player) => {
        return defenderPlayer.countries.length === 0;
    }

    private updatePlayer = (player: Player, game: Game): Game => {
        const players = _.cloneDeep(game.players);
        const playerIdx = players.findIndex(p => p.id === player.id);

        players[playerIdx] = player;

        return {
            ...game,
            players
        };
        // this.updateGame({
        //     ...this.firebaseService._game,
        //     players
        // });
    }

    updateGame2 = (turn: Turn, country: Country, player: Player, deck: Card[] = null) => {
        debugger;
        let updatedGame = _.cloneDeep(this.firebaseService._game);
        if (country) {
            updatedGame = this.updateCountry(country, updatedGame);
        }

        if (player) {
            updatedGame = this.updatePlayer(player, updatedGame);
        }

        if (turn) {
            updatedGame = this.updateTurn(turn, updatedGame);
        }

        if (deck) {
            updatedGame = {
                ...updatedGame,
                cardsDeck: deck
            }
        }

        this.updateGame(updatedGame);
    }

    private updateCountry = (country: Country, game: Game) => {
        const updatedPlayers = game.players;
        const playerOwnerIdx = updatedPlayers.findIndex(p => p.id === country.ownerId);

        const countryIdx = updatedPlayers[playerOwnerIdx].countries.findIndex(c => c.name === country.name);
        updatedPlayers[playerOwnerIdx].countries[countryIdx] = country;

        return {
            ...game,
            players: updatedPlayers,
        }
        // this.updateGame({
        //     ...this.firebaseService._game,
        //     players: updatedPlayers
        // })
    }

    getPlayer = playerId => {
        return _.cloneDeep(this.firebaseService._game.players.find(p => p.id === playerId));
    }

    getCountry = (countryName: string): Country => {
        let country;
        this.firebaseService._game.players.forEach(p => {
            const idx = p.countries.findIndex(c => c.name === countryName);
            if (idx !== -1) {
                country = p.countries[idx];
            }
        });

        return _.cloneDeep(country);
    }

    getCurrentTurn = (): Turn => {
        const actualRound = _.cloneDeep(this.firebaseService._round);
        return _.cloneDeep(actualRound.turn);
    }

    private updateTurn = (turn: Turn, game: Game) => {
        const actualRound = _.cloneDeep(this.firebaseService._round);
        actualRound.turn = turn;

        return {
            ...game,
            round: actualRound
        }
        // this.updateGame({
        //     ...this.firebaseService._game,
        //     rounds: [
        //         ...this.firebaseService._rounds,
        //         actualRound
        //     ]
        // });
        // this.firebaseService._rounds.next([
        //     ...this.firebaseService._rounds.getValue(),
        //     actualRound
        // ]);
    }

    getNextCard = (): { card, updatedDeck } => {
        const deck = _.cloneDeep(this.firebaseService._game.cardsDeck);
        const card = deck.pop();

        let updatedDeck = deck;
        if (deck.length === 0) {
            updatedDeck = _.shuffle(CARDS).map(c => ({
                country: c.name,
                symbol: c.symbol,
                used: false
            }));
        }

        // this.updateGame({
        //     ...this.firebaseService._game,
        //     cardsDeck: updatedDeck
        // })
        return { card, updatedDeck };
    }

    private getPlayerIndex = (id: string) => this.firebaseService._game?.players?.findIndex(p => p.id === id);

    private updateGame = (game: Game) => this.firebaseService.updateGame(game);
}