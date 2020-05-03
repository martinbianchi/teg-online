import { Country } from './country.model';
import { Card } from './card.model';
import { Goal } from './goal.model';

export interface Player {
    id: string;
    name: string;
    countries: Country[];
    cards: Card[];
    continentCards: Card[];
    goal: Goal;
    swaps: number;
    requiredCountriesToGetCard: number;
    color: string;
    continentUsedCards: ContinentUsedCards;
}

export interface ContinentUsedCards {
    northamerica: boolean;
    centralamerica: boolean;
    southamerica: boolean;
    oceania: boolean;
    afrika: boolean;
    asia: boolean;
    europe: boolean;
}