import { Injectable } from '@angular/core';
import { Goal } from '../models/goal.model';
import { Player } from '../models/player.model';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class GoalService {
    COMMON_GOAL = 45;

    evaluateGoal = (player: Player) => {
        let won = false;

        if (player?.goal.common > 0) {
            won = this.evaluateCommon(player);
        }
        else if (!player?.goal?.destroyPlayer) {
            won = this.evaluateCountriesGoal(player);
        }

        if (!won) {
            won = this.evaluateNoGoal(player);
        }

        return won;
    }

    evaluateDestroyGoal = (player: Player, destroyedPlayerId: string) => {
        return player.goal.destroyPlayer?.id === destroyedPlayerId;
    }

    createDestroyGoals = (players: Player[]): Goal[] => {
        return players.map(p => ({
            afrika: 0,
            asia: 0,
            centralamerica: 0,
            common: 0,
            destroyPlayer: _.cloneDeep(p),
            europe: 0,
            northamerica: 0,
            oceania: 0,
            southamerica: 0,
            title: `Destruir al ejercito de ${p.name}`,
        }));
    }

    assignGoal = (player: Player, goals: Goal[]) => {
        const goalsToChoose = goals.filter(g => g.destroyPlayer?.id !== player.id);
        return goalsToChoose.pop();
    }

    private evaluateCommon = (player: Player) => {
        return player.countries.length >= player.goal.common;
    }

    private evaluateCountriesGoal = (player: Player) => {
        const playerCountries = {
            asia: 0,
            europe: 0,
            afrika: 0,
            centralamerica: 0,
            northamerica: 0,
            oceania: 0,
            southamerica: 0,
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
    }

    private evaluateNoGoal = (player: Player) => {
        return player.countries.length >= this.COMMON_GOAL;
    }


}
