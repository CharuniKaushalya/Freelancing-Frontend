import { Injectable } from '@angular/core';

import { AngularFireAuthModule, AngularFireAuth, AngularFireAuthProvider } from 'angularfire2/auth';

import * as firebase from 'firebase';

@Injectable()
export class AuthService {

  user:any;

  constructor(private afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(user => {
      console.log(user);
      this.user = user;
      localStorage.setItem("user", user.email);
    });
  }

  getAuth(){
    return this.afAuth;
  }

  signIn(email:string,password:string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email,password);
  }

  signInWithGoogle() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  signInWithFacebook() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  signInWithTwitter() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
  }

  signUp(email:string,password:string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email,password);
  }

  signOut() {
    localStorage.setItem("user", "");
    return this.afAuth.auth.signOut();
  }

}
