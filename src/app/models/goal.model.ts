import { Country } from './country.model';
import { Player } from './player.model';

export interface Goal {
    title: string;
    description: string;
    countriesRequired: Country[];
    destroyPlayer: Player;
}