import { RoundConditions } from './round-conditions.model';
import { RoundType } from './round-type.model';
import { Turn } from './turn.model';

export interface Round {
    number: number;
    turn?: Turn;
    roundConditions: RoundConditions;
    roundType: RoundType;
}