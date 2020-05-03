import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';
import { CardSymbolEnum } from '../models/card-symbol.enum';

@Injectable({ providedIn: 'root' })
export class SwapService {
    constructor() { }

    getNumberOfArmies = (numberOfSwaps) => {
        if (numberOfSwaps === 1) {
            return 6;
        }
        return 5 * numberOfSwaps;
    }

    validSwap = (cards: Card[]) => {
        if (cards.length === 1) {
            // Must be a direct swap card.
            return cards[0].symbol === CardSymbolEnum.DIRECTSWAP;
        }

        if (cards.length === 3) {

            if (this.hasJoker(cards)) {
                return true;
            }

            if (this.threeEquals(cards)) {
                return true;
            }

            return this.threeDifferents(cards);
        }

        if (cards.length === 2) {
            // Continent card included. Southamerica or Afrika.
            if (this.hasSouthAmerica(cards)) {
                // southamerica has ship and plane, we need a tank or a joker.
                return cards.filter(c => c.symbol === CardSymbolEnum.TANK || c.symbol === CardSymbolEnum.JOKER).length;
            }

            if (this.hasAfrika(cards)) {
                // southamerica has ship and tank, we need a plane or a joker.
                return cards.filter(c => c.symbol === CardSymbolEnum.PLANE || c.symbol === CardSymbolEnum.JOKER).length;
            }
        }

        return false;
    }

    private hasSouthAmerica = (cards: Card[]) => {
        return cards.filter(c => c.country === 'southamerica').length;
    }

    private hasAfrika = (cards: Card[]) => {
        return cards.filter(c => c.country === 'afrika').length;
    }

    private hasJoker = (cards: Card[]) => {
        return cards.filter(c => c.symbol === CardSymbolEnum.JOKER).length;
    }

    private threeEquals = (cards: Card[]) => {
        return cards[0].symbol === cards[1].symbol && cards[0].symbol === cards[2].symbol;
    }

    private threeDifferents = (cards: Card[]) => {
        return cards[0].symbol !== cards[1].symbol
            && cards[0].symbol !== cards[2].symbol
            && cards[1].symbol !== cards[2].symbol;
    }
}