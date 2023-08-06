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

    const expirationTimeStored = localStorage.getItem('expirationTime');
    if (expirationTimeStored != null) {
      const expirationTime = new Date(+expirationTimeStored).getTime();
      const currentTime = new Date().getTime();
      const expirationDuration = expirationTime - currentTime;
      this.autoLogout(expirationDuration);
      console.log(expirationDuration);
    }
  }

  // fetch users uids (document id in firestore collection)
  getUsersUid() {
    this.usersDatabase.get().subscribe((data) => {
      data.docs.forEach((doc) => {
        this.uids.push(doc.id);
      });
    });
  }

  // initialize users database on sign in
  initStorage(res: UserCredential, name?: string) {
    if (this.uids.some((uid) => uid == res.user.uid)) {
      this.getUserWatchList(res.user.uid);
      this.usersDatabase.doc(res.user.uid).update({ email: res.user.email });
      return;
    }

    this.usersDatabase.doc(res.user.uid).set({
      displayName: name,
      email: res.user.email,
      emailVerified: res.user.emailVerified,
      watchList: [],
    });
    this.getUserWatchList(res.user.uid);
  }

  // fetch user watchList
  getUserWatchList(uid) {
    this.usersDatabase
      .doc(uid)
      .get()
      .subscribe((data) => {
        // if user had watchList movies before authentication feature was added
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
        const expirationTime = res.user['stsTokenManager'].expirationTime;
        const currentUser = this.auth.currentUser;
        updateProfile(currentUser, {
          displayName: name,
        });

        localStorage.setItem('expirationTime', expirationTime);
        localStorage.setItem('username', name);
        localStorage.setItem('user', JSON.stringify(res));
        this.isLoggedIn();

        this.router.navigate(['/', 'movies']);
        console.log(res);

        this.initStorage(res, name);

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
        this.handleAuthentication(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  signIn(email: string, password: string) {
    this.isLoading.next(true);
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((res) => {
        this.handleAuthentication(res);
      })
      .catch((err: FirebaseError) => {
        this.isLoading.next(false);
        console.log(err);

        this.errorMessage.next(this.getErrorMessage(err.code));
      });
  }

  handleAuthentication(res: UserCredential, name?, isSignUp?) {
    const expirationTime = res.user['stsTokenManager'].expirationTime;

    const currentUser = res.user.displayName;
    this.user.next({ displayName: currentUser });
    localStorage.setItem('username', currentUser);
    this.initStorage(res);

    this.isLoading.next(false);
    this.isAuthenticated.next(true);

    localStorage.setItem('expirationTime', expirationTime);
    localStorage.setItem('user', JSON.stringify(res));
    this.isLoggedIn();

    const url = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.router.navigateByUrl(url);

    this.autoLogout(3600000);
  }

  signOut() {
    return signOut(this.auth).then((res) => {
      // localStorage.setItem('expirationTime', null);

      // localStorage.setItem('username', '');
      // localStorage.setItem('user', null);
      // localStorage.setItem('liked', null);
      // this.userWatchList.next(null);
      // this.clearWatchList.next(true);

      // this.isLoggedIn();
      // clearTimeout(this.logOutTimeout);

      // if (this.reqAuth) {
      //   this.router.navigate(['/']);
      // }
      this.handleSignOut();
    });
  }

  isLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));

    const isUser = user != null ? true : false;

    this.isAuthenticated.next(isUser);
  }

  autoLogout(tokenExpirTime: number) {
    this.logOutTimeout = setTimeout(() => {
      // localStorage.setItem('expirationTime', null);

      // localStorage.setItem('username', '');
      // localStorage.setItem('user', null);
      // localStorage.setItem('liked', null);
      // this.userWatchList.next(null);
      // this.clearWatchList.next(true);

      // if (this.reqAuth) {
      //   this.router.navigate(['/']);
      // }

      // this.isLoggedIn();
      this.handleSignOut();
    }, tokenExpirTime);
  }

  handleSignOut() {
    localStorage.setItem('expirationTime', null);

    localStorage.setItem('username', '');
    localStorage.setItem('user', null);
    localStorage.setItem('liked', null);
    this.userWatchList.next(null);
    this.clearWatchList.next(true);

    this.isLoggedIn();
    if (this.logOutTimeout) {
      clearTimeout(this.logOutTimeout);
    }

    if (this.reqAuth) {
      this.router.navigate(['/']);
    }
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
