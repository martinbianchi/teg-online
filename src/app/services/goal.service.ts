import { Injectable } from '@angular/core';
import { Goal } from '../models/goal.model';
import { Player } from '../models/player.model';

@Injectable({ providedIn: 'root' })
export class GoalService {
    COMMON_GOAL = 45;

    evaluateGoal = (player: Player) => {
        let won = false;

        if (player?.goal.common > 0) {
            won = this.evaluateCommon(player);
        }
        won = this.evaluateCountriesGoal(player);
        // TODO: implement destroy.

        if (!won) {
            won = this.evaluateNoGoal(player);
        }

        return won;
    }

    evaluateDestroyGoal = (player: Player, destroyedPlayerId: string) => {
        return player.goal.destroyPlayer?.id === destroyedPlayerId;
    }

    private evaluateCommon = (player: Player) => {
        return player.countries.length >= player.goal.common;
    };

    private evaluateCountriesGoal = (player: Player) => {
        const playerCountries = {
            asia: 0,
            europe: 0,
            afrika: 0,
            centralAmerica: 0,
            northAmerica: 0,
            oceania: 0,
            southAmerica: 0,
        };
        player.countries.forEach(c => {
            playerCountries[c.continent] = playerCountries[c.continent] + 1;
        });

        let won = true;
        Object.keys(playerCountries).forEach((key) => {
            if (playerCountries[key] < player.goal[key]) {
                won = false;
            }
        });

        return won;
    };

    private evaluateNoGoal = (player: Player) => {
        return player.countries.length >= this.COMMON_GOAL;
    };
}