import { Country } from './country.model';
import { Player } from './player.model';

export interface Goal {
    title: string;
    afrika: number;
    oceania: number;
    southAmerica: number;
    northAmerica: number;
    centralAmerica: number;
    asia: number;
    europe: number;
    destroyPlayer: Player;
    common: number;
}