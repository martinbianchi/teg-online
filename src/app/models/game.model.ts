import { Player } from './player.model';
import { RoundConditions } from './round-conditions.model';
import { Card } from './card.model';
import { Round } from './round.model';

export interface Game {
    key?: string;
    players: Player[];
    roundNumber: number;
    roundCondition: RoundConditions;
    cardsDeck: Card[];
    round: Round;
    playersOrder: Player[];
    started: boolean;
    finished: boolean;
    name: string;
    winner: Player;
}