import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class DiceService {
    constructor(
        private route: ActivatedRoute,
        private firebaseService: FirebaseService
    ) { }

    throwDices = (times: number, attacking: boolean): number[] => {
        this.firebaseService.resetDices();
        const result = [];
        for (let i = 0; i < times; i++) {
            result.push(this.getDice());
            attacking
                ? this.firebaseService.pushAttackDices(result.sort(this.sortDices))
                : this.firebaseService.pushDefendDices(result.sort(this.sortDices));
        }

        return result;
    }

    getDice = () => {
        return _.random(1, 6, false);
    }

    private sortDices = (a, b) => b - a;
}