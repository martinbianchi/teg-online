import { Country } from './country.model';
import { Card } from './card.model';
import { Goal } from './goal.model';
import { ArmiesToAdd } from './armies-to-add.model';

export interface Player {
    id: string;
    countries: Country[];
    cards: Card[];
    goal: Goal;
    swaps: number;
    requiredCountriesToGetCard: number;
    color: string;
}