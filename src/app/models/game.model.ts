import { Player } from './player.model';
import { RoundConditions } from './round-conditions.model';
import { Card } from './card.model';

export interface Game {
    _id?: string;
    players: Player[];
    roundNumber: number;
    roundCondition: RoundConditions;
    cardsDeck: Card[];
}