import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authFire: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    console.log(auth);


  }

  loginWithGoogle = () => {
    console.log(auth);
    this.authFire.signInWithPopup(new auth.GoogleAuthProvider()).then((val) => {
      console.log(val);
    });
  }

}
