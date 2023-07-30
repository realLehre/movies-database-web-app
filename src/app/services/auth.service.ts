import { Injectable } from '@angular/core';
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
  constructor(
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  signUp(name: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password).then(
      (res) => {
        this.isUser.next(true);

        const currentUser = this.auth.currentUser;
        updateProfile(currentUser, {
          displayName: name,
        });

        this.user.next({ displayName: name });
        localStorage.setItem('username', name);
        localStorage.setItem('user', JSON.stringify(res));

        this.router.navigate(['/', 'movies']);
      }
    );
  }

  authWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider()).then((res) => {
      const currentUser = res.user.displayName;
      this.user.next({ displayName: currentUser });
      localStorage.setItem('username', currentUser);
      localStorage.setItem('user', JSON.stringify(res));

      this.router.navigate(['/', 'movies']);
    });
  }

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password).then(
      (res) => {
        const currentUser = res.user.displayName;
        this.user.next({ displayName: currentUser });
        localStorage.setItem('username', currentUser);
        localStorage.setItem('user', JSON.stringify(res));

        this.router.navigate(['/', 'movies']);
      }
    );
  }

  signOut() {
    return signOut(this.auth).then((res) => {
      this.isUser.next(false);
      localStorage.setItem('username', '');
      localStorage.setItem('user', null);
      this.route.url.subscribe((data) => {
        // if (data[1].path == 'watchlist') {
        //   this.router.navigate(['/']);
        // }
        console.log(data);
      });
    });
  }

  get isLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));

    return user != null ? true : false;
  }
}
