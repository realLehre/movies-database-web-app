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
  UserCredential,
} from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { User } from '../shared/user.model';
import { MovieObject } from '../shared/movie.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new Subject<{ displayName: string }>();
  userId = new Subject<string>();
  isAuthenticated = new Subject<boolean>();
  isLoading = new Subject<boolean>();
  logOutTimeout!: any;
  errorMessage = new Subject<string>();
  reqAuth: boolean = false;
  usersDatabase: AngularFirestoreCollection<User>;
  userWatchList = new Subject<MovieObject[]>();
  clearWatchList = new Subject<boolean>();
  uids: string[] = [];

  constructor(
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private db: AngularFirestore
  ) {
    this.usersDatabase = this.db.collection('users');
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

    this.getUsersUid();
  }

  getUsersUid() {
    this.usersDatabase.get().subscribe((data) => {
      data.docs.forEach((doc) => {
        this.uids.push(doc.id);
      });
    });
  }

  initStorage(res: UserCredential) {
    if (this.uids.some((uid) => uid == res.user.uid)) {
      this.getUserWatchList(res.user.uid);
      this.usersDatabase.doc(res.user.uid).update({ email: res.user.email });
      return;
    }

    this.usersDatabase.doc(res.user.uid).set({
      displayName: res.user.displayName,
      email: res.user.email,
      emailVerified: res.user.emailVerified,
      watchList: [],
    });
    this.getUserWatchList(res.user.uid);
  }

  getUserWatchList(uid) {
    this.usersDatabase
      .doc(uid)
      .get()
      .subscribe((data) => {
        const oldWatchList = JSON.parse(localStorage.getItem('liked'));

        if (oldWatchList != null) {
          localStorage.setItem(
            'liked',
            JSON.stringify([...data.data().watchList, ...oldWatchList])
          );
          this.userWatchList.next([...data.data().watchList, ...oldWatchList]);
        }

        localStorage.setItem('liked', JSON.stringify(data.data().watchList));
        this.userWatchList.next(data.data().watchList);
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
        this.initStorage(res);

        this.autoLogout(3600000);
      })
      .catch((err: FirebaseError) => {
        this.isLoading.next(false);
        console.log(err);

        this.errorMessage.next(this.getErrorMessage(err.code));
      });
  }

  authWithGoogle() {
    this.isLoading.next(true);
    return signInWithPopup(this.auth, new GoogleAuthProvider())
      .then((res) => {
        const currentUser = res.user.displayName;
        this.isLoading.next(false);
        this.isAuthenticated.next(true);
        this.user.next({ displayName: currentUser });
        this.userId.next(res.user.uid);

        localStorage.setItem('username', currentUser);
        localStorage.setItem('user', JSON.stringify(res));
        this.isLoggedIn();

        const url = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(url);
        this.initStorage(res);
        this.autoLogout(3600000);
      })
      .catch((err) => {
        console.log(err);
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

        this.initStorage(res);
        this.autoLogout(3600000);
      })
      .catch((err: FirebaseError) => {
        this.isLoading.next(false);
        console.log(err);

        this.errorMessage.next(this.getErrorMessage(err.code));
      });
  }

  signOut() {
    return signOut(this.auth).then((res) => {
      localStorage.setItem('username', '');
      localStorage.setItem('user', null);
      localStorage.setItem('liked', null);
      // this.movieService.emitUserWatchList(null);
      this.userWatchList.next(null);
      this.clearWatchList.next(true);

      this.isLoggedIn();
      if (this.logOutTimeout) {
        this.logOutTimeout.clearTimeOut();
      }

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
    this.logOutTimeout = setTimeout(() => {
      localStorage.setItem('username', '');
      localStorage.setItem('user', null);
      localStorage.setItem('liked', null);
      // this.movieService.emitUserWatchList(null);
      this.userWatchList.next(null);
      this.clearWatchList.next(true);

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
