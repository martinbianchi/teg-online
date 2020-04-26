import { Country } from './country.model';
import { Player } from './player.model';

export interface Goal {
    title: string;
    afrika: number;
    oceania: number;
    southamerica: number;
    northamerica: number;
    centralamerica: number;
    asia: number;
    europe: number;
    destroyPlayer: Player;
    common: number;
}