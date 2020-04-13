import { Player } from './player.model';

export interface RoundConditions {
    extraAttackArmy: number;
    extraDefenseArmy: number;
    playerBlocked: Player;
    canAttackOutsideBordering: boolean;
    canAttackInsideBordering: boolean;
}