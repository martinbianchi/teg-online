import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _userLogged = new BehaviorSubject<User>(null);
    userLogged$ = this._userLogged.asObservable();
    constructor() { }

    setUserLogged = (id, displayName) => this._userLogged.next({ displayName, id });

    logoutUser = () => this._userLogged.next(null);

    getUserId = () => this._userLogged.getValue().id;
}