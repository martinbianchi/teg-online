import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class DiceService {
    constructor() { }

    throwDices = (times: number): number[] => {
        const result = [];
        for (let i = 0; i < times; i++) {
            result.push(this.getDice());
        }

        console.info(result);
        return result;
    }

    getDice = () => _.random(1, 6, false);

}