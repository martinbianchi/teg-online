import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { AngularFireAuth } from '@angular/fire/auth/';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  allGames$ = this.firebaseService.getAllGames();

  constructor(
    private firebaseService: FirebaseService,
    private authFire: AngularFireAuth,
    private authService: AuthService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.authFire.authState.subscribe((state) => {
      if (state?.uid) {
        this.authService.setUserLogged(state.uid, state.displayName);
        this.router.navigate(['']);
      } else {
        this.authService.logoutUser();
        this.router.navigate(['login']);
      }
    });
  }
}
