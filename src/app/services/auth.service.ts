import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new Subject<{ displayName: string }>();
  isUser = new Subject<boolean>();
  isLoading = new Subject<boolean>();
  errorMessage = new Subject<string>();

  constructor(
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  signUp(name: string, email: string, password: string) {
    this.isLoading.next(true);
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((res) => {
        this.isUser.next(false);

        const currentUser = this.auth.currentUser;
        updateProfile(currentUser, {
          displayName: name,
        });

        this.user.next({ displayName: name });
        localStorage.setItem('username', name);
        localStorage.setItem('user', JSON.stringify(res));

        this.router.navigate(['/', 'movies']);
      })
      .catch((err: FirebaseError) => {
        this.isLoading.next(false);

        this.errorMessage.next(this.getErrorMessage(err.code));
      });
  }

  authWithGoogle() {
    this.isLoading.next(true);
    return signInWithPopup(this.auth, new GoogleAuthProvider()).then((res) => {
      this.isUser.next(false);
      const currentUser = res.user.displayName;
      this.user.next({ displayName: currentUser });
      localStorage.setItem('username', currentUser);
      localStorage.setItem('user', JSON.stringify(res));

      this.router.navigate(['/', 'movies']);
    });
  }

  signIn(email: string, password: string) {
    this.isLoading.next(true);
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((res) => {
        this.isUser.next(false);
        const currentUser = res.user.displayName;
        this.user.next({ displayName: currentUser });
        localStorage.setItem('username', currentUser);
        localStorage.setItem('user', JSON.stringify(res));
        const url = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(url);
      })
      .catch((err: FirebaseError) => {
        this.isLoading.next(false);

        this.errorMessage.next(this.getErrorMessage(err.code));
      });
  }

  signOut() {
    return signOut(this.auth).then((res) => {
      this.isUser.next(false);
      localStorage.setItem('username', '');
      localStorage.setItem('user', null);
    });
  }

  get isLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));

    return user != null ? true : false;
  }

  getErrorMessage(err: any) {
    switch (err) {
      case 'auth/email-already-in-use': {
        return 'Email already in use';
      }
      case 'auth/wrong-password': {
        return 'Password is incorrect';
      }
      case 'auth/user-not-found': {
        return 'User not found';
      }
      default: {
        return 'An error occured, try again later';
      }
    }
  }
}
