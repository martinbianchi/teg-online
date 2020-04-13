import { Injectable, PlatformRef } from '@angular/core';
import { Country } from '../models/country.model';
import { DiceService } from './dice.service';
import { AttackResult } from '../models/attack-result.model';
import { GameService } from './game.service';
import { Player } from '../models/player.model';

import * as _ from 'lodash';
import { ArmiesToAdd } from '../models/armies-to-add.model';
import { Card } from '../models/card.model';
import { SwapService } from './swap.service';

@Injectable({ providedIn: 'root' })
export class TurnService {
    constructor(
        private diceService: DiceService,
        private gameService: GameService,
        private swapService: SwapService,
    ) { }

    attackCountry = (attackerName: string, defenderName: string) => {
        const attacker = this.gameService.getCountry(attackerName);
        const defender = this.gameService.getCountry(defenderName);
        if (attacker.ownerId === defender.ownerId) {
            return;
        }

        const attackerArmies = this.getAttackerArmies(attacker.armies);
        const defenderArmies = this.getDeffenderArmies(defender.armies);

        const attackDices = this.diceService.throwDices(attackerArmies);
        const defenderDices = this.diceService.throwDices(defenderArmies);

        const attackResult = this.evaluateDices(attackDices, defenderDices);

        if (attackResult.defenderLostArmies >= defender.armies) {
            attackResult.conquered = true;
            attackResult.attackerLostArmies += 1;

            const currentTurn = this.gameService.getCurrentTurn();
            currentTurn.conqueredCountries += 1;
            this.gameService.updateTurn(currentTurn);
        }

        this.gameService.updateAfterAttack(attacker, defender, attackResult);
    }

    addArmies = (countryName: string, quantity: number) => {
        const currentTurn = this.gameService.getCurrentTurn();
        const country = this.gameService.getCountry(countryName);

        if (currentTurn.armiesToAdd[country.continent] >= quantity) {
            // Continent armies
            country.armies += quantity;
            currentTurn.armiesToAdd[country.continent] -= quantity;
        } else if (currentTurn.armiesToAdd.general >= quantity) {
            country.armies += quantity;
            currentTurn.armiesToAdd.general -= quantity;
        }
        if (this.dontHaveMoreArmies(currentTurn.armiesToAdd)) {
            currentTurn.armiesAdded = true;
        }

        this.gameService.updateCountry(country);
        this.gameService.updateTurn(currentTurn);
    }

    private dontHaveMoreArmies = (armiesToAdd: ArmiesToAdd) => {
        return !Object.values(armiesToAdd).filter(v => v !== 0).length;
    }

    moveArmies = (fromCountry: string, toCountry: string, quantity: number) => {
        const player = this.gameService.getPlayer(localStorage.getItem('my_id'));
        const fromCountryIdx = player.countries.findIndex(c => c.name === fromCountry);
        const toCountryIdx = player.countries.findIndex(c => c.name === toCountry);
        const updatedPlayer = _.cloneDeep(player);
        updatedPlayer.countries[fromCountryIdx] = {
            ...updatedPlayer.countries[fromCountryIdx],
            armies: updatedPlayer.countries[fromCountryIdx].armies - quantity
        }

        updatedPlayer.countries[toCountryIdx] = {
            ...updatedPlayer.countries[toCountryIdx],
            armies: updatedPlayer.countries[toCountryIdx].armies + quantity
        }
        this.gameService.updatePlayer(updatedPlayer);

        const currentTurn = this.gameService.getCurrentTurn();
        if (!currentTurn.attacked) {
            currentTurn.attacked = true;
            this.gameService.updateTurn(currentTurn);
        }
    }

    private evaluateDices = (attacker: number[], defender: number[]): AttackResult => {
        const evaluations = Math.min(attacker.length, defender.length);
        let attackerLostArmies = 0;
        let defenderLostArmies = 0;
        for (let i = 0; i < evaluations; i++) {
            if (attacker[i] > defender[i]) {
                defenderLostArmies++;
            } else {
                attackerLostArmies++;
            }
        }

        return {
            attackerLostArmies,
            defenderLostArmies,
            conquered: false // Default value, we evaluate outside.
        }
    }

    private getAttackerArmies = (armies: number) => {
        // TODO: Check game conditions. for example favor wind

        if (armies > 3) {
            return 3;
        }
        return armies - 1; // 2 or 3.
    }

    private getDeffenderArmies = (armies: number) => {
        // TODO: Check game conditions. for example snow

        if (armies >= 3) {
            return 3;
        }
        return armies; // 1 or 2.
    }

    useCard = (card: Card) => {
        const currentTurn = this.gameService.getCurrentTurn();
        const player = this.gameService.getPlayer(currentTurn.player.id);

        const countryCardIdx = player.countries.findIndex(c => c.name === card.country);
        const cardUsedIdx = player.cards.findIndex(c => c.country === card.country);

        if (cardUsedIdx !== -1 && !player.cards[cardUsedIdx].used) {
            if (countryCardIdx !== -1) {
                player.countries[countryCardIdx].armies += 3;
                player.cards[cardUsedIdx].used = true;

                this.gameService.updatePlayer(player);
            }
        }

    }

    getCard = () => {
        const currentTurn = this.gameService.getCurrentTurn();

        if (currentTurn.conqueredCountries >= currentTurn.player.requiredCountriesToGetCard) {
            const player = this.gameService.getPlayer(currentTurn.player.id);
            if (player.cards.length < 5) {
                const card = this.gameService.getNextCard();
                player.cards.push(card);
                this.gameService.updatePlayer(player);

                currentTurn.attacked = true;
                currentTurn.regrouped = true;
                currentTurn.getCard = true;
                this.gameService.updateTurn(currentTurn);
            }

        }
    }

    makeSwap = (cards: Card[]) => {
        const turn = this.gameService.getCurrentTurn();
        if (turn.armiesAdded || turn.attacked || turn.conqueredCountries || turn.getCard || turn.regrouped) {
            // Isn't the moment to make a swap. throw an error or notify.

            return;
        }

        const player = this.gameService.getPlayer(turn.player.id);

        const cardsToSwapNames = cards.map(c => c.country);
        const cardsUpdated = player.cards.filter(c => !cardsToSwapNames.includes(c.country));

        player.swaps += 1;
        player.cards = cardsUpdated;

        const quantityOfArmies = this.swapService.getNumberOfArmies(player.swaps);
        turn.armiesToAdd.general += quantityOfArmies;

        this.gameService.updateTurn(turn);
        this.gameService.updatePlayer(player);
    }
}