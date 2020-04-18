import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private authFire: AngularFireAuth,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return new Observable<boolean>(subscriber => {
            this.authFire.currentUser.then(user => {
                if (user) {
                    subscriber.next(true);
                } else {
                    subscriber.next(false);
                    this.router.navigate(['/login']);
                }
                subscriber.complete();
            }).catch(err => {
                subscriber.next(false);
                this.router.navigate(['/login']);
                subscriber.complete();
            });
        });
    }
}