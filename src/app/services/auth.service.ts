import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
// import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {}

  signIn() {
    return signInWithPopup(this.auth, new GoogleAuthProvider()).then(() => {
      console.log('yes');
    });
  }
}
