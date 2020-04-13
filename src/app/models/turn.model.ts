import { Player } from './player.model';
import { ArmiesToAdd } from './armies-to-add.model';

export interface Turn {
    player: Player;
    armiesToAdd: ArmiesToAdd;
    armiesAdded: boolean;
    attacked: boolean;
    regrouped: boolean;
    getCard: boolean;
    conqueredCountries: number;
}