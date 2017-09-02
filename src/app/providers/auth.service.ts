import { Injectable } from '@angular/core';

import { AngularFireAuthModule, AngularFireAuth, AngularFireAuthProvider } from 'angularfire2/auth';
import {
  FaAppModule,
  FaDatabaseModule, Database, ListFactory,
  FaAuthModule, Auth, AuthProviders
} from 'firebase/auth';

@Injectable()
export class AuthService {

  user:any;

  constructor(private afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(user => {
      console.log(user);
      this.user = user;
    });
  }

  getAuth(){
    return this.afAuth;
  }

  signIn(email:string,password:string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email,password);
  }

  signUp(email:string,password:string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email,password);
  }

  signOut() {
    return this.afAuth.auth.signOut();
  }

}
