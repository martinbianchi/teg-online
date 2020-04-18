import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Injectable({ providedIn: 'root' })
export class UnfinishedGuard implements CanActivate {
    constructor(
        private firebaseService: FirebaseService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.firebaseService._game.finished) {

            this.router.navigate(['/', route.params['id'], 'congrats']);

            return false;
        }

        return true;
    }
}