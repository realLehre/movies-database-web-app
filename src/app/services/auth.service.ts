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
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new Subject<{ displayName: string }>();
  isAuthenticated = new Subject<boolean>();
  isLoading = new Subject<boolean>();
  errorMessage = new Subject<string>();
  reqAuth: boolean = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isLoggedIn();
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => this.route.firstChild),
        switchMap((route) => route.data)
      )
      .subscribe((route) => {
        this.reqAuth = route['reqAuth'];
      });
  }

  signUp(name: string, email: string, password: string) {
    this.isLoading.next(true);
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((res) => {
        this.isLoading.next(false);
        this.isAuthenticated.next(true);
        this.user.next({ displayName: name });

        const currentUser = this.auth.currentUser;
        updateProfile(currentUser, {
          displayName: name,
        });

        this.user.next({ displayName: name });
        localStorage.setItem('username', name);
        localStorage.setItem('user', JSON.stringify(res));
        this.isLoggedIn();

        this.router.navigate(['/', 'movies']);

        this.autoLogout(3600000);
      })
      .catch((err: FirebaseError) => {
        this.isLoading.next(false);

        this.errorMessage.next(this.getErrorMessage(err.code));
      });
  }

  authWithGoogle() {
    this.isLoading.next(true);
    return signInWithPopup(this.auth, new GoogleAuthProvider()).then((res) => {
      const currentUser = res.user.displayName;
      this.isLoading.next(false);
      this.isAuthenticated.next(true);
      this.user.next({ displayName: currentUser });

      localStorage.setItem('username', currentUser);
      localStorage.setItem('user', JSON.stringify(res));
      this.isLoggedIn();

      const url = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigateByUrl(url);
      this.autoLogout(3600000);
    });
  }

  signIn(email: string, password: string) {
    this.isLoading.next(true);
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((res) => {
        const currentUser = res.user.displayName;
        this.isLoading.next(false);
        this.isAuthenticated.next(true);
        this.user.next({ displayName: currentUser });

        localStorage.setItem('username', currentUser);
        localStorage.setItem('user', JSON.stringify(res));
        this.isLoggedIn();

        const url = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(url);

        this.autoLogout(3600000);
      })
      .catch((err: FirebaseError) => {
        this.isLoading.next(false);

        this.errorMessage.next(this.getErrorMessage(err.code));
      });
  }

  signOut() {
    return signOut(this.auth).then((res) => {
      localStorage.setItem('username', '');
      localStorage.setItem('user', null);
      this.isLoggedIn();

      if (this.reqAuth) {
        this.router.navigate(['/']);
      }
    });
  }

  isLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));

    const isUser = user != null ? true : false;

    this.isAuthenticated.next(isUser);
  }

  autoLogout(tokenExpirTime: number) {
    setTimeout(() => {
      localStorage.setItem('username', '');
      localStorage.setItem('user', null);

      if (this.reqAuth) {
        this.router.navigate(['/']);
      }

      this.isLoggedIn();
    }, tokenExpirTime);
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
