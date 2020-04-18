import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Country } from '../models/country.model';
import { GameService } from './game.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class MapService {

    private firstSelectedCountry = new BehaviorSubject<string>(null);
    firstSelectedCountry$ = this.firstSelectedCountry.asObservable();
    private secondSelectedCountry = new BehaviorSubject<string>(null);
    secondSelectedCountry$ = this.secondSelectedCountry.asObservable();


    constructor(
        private gameService: GameService,
        private authService: AuthService
    ) { }

    selectCountry = (countryName) => {
        const countrySelected = this.gameService.getCountry(countryName);
        const actualTurn = this.gameService.getCurrentTurn();
        const firstSelected = this.firstSelectedCountry.getValue();
        const secondSelected = this.secondSelectedCountry.getValue();

        if (actualTurn.armiesAdded) {
            this.selectWithAttackingRules(countrySelected, firstSelected, secondSelected);
        } else {
            this.selectWithAddArmyRules(countrySelected);
        }
    }

    selectWithAttackingRules = (countrySelected: Country, firstSelected: string, secondSelected: string) => {
        if (!firstSelected) {
            if (countrySelected.ownerId === this.getMyId()) {
                return this.firstSelectedCountry.next(countrySelected.name);
            }
            return this.firstSelectedCountry.next(null);
        }

        if (firstSelected && !secondSelected) {
            const countryFirstSelected = this.gameService.getCountry(firstSelected);
            if (firstSelected !== countrySelected.name) {
                const firstSelectedCountry = this.gameService.getCountry(firstSelected);
                if (firstSelectedCountry.borderingCountries.includes(countrySelected.name)) {
                    return this.secondSelectedCountry.next(countrySelected.name);
                }
            } else {
                this.firstSelectedCountry.next(null);
            }
        }

        if (firstSelected && secondSelected) {
            this.firstSelectedCountry.next(null);
            this.secondSelectedCountry.next(null);
            this.selectCountry(countrySelected.name);
        }
    }

    getMyId = () => {
        return this.authService.getUserId();
    }

    selectWithAddArmyRules = (countrySelected: Country) => {
        if (countrySelected.ownerId === this.getMyId()) {
            return this.firstSelectedCountry.next(countrySelected.name);
        }
        return this.firstSelectedCountry.next(null);
    }

}