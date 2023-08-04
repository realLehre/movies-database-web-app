import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { UserCredential } from 'firebase/auth';
import { User } from '../shared/user.model';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class WatchListService {
  usersDatabase: AngularFirestoreCollection<User>;
  uid!: string;
  uids: string[] = [];

  constructor(private db: AngularFirestore, private auth: AuthService) {
    this.usersDatabase = this.db.collection('users');

    // const user = JSON.parse(localStorage.getItem('user'));
    // if (user == null) {
    //   this.auth.userId.subscribe((uid) => {
    //     this.getUserWatchList(uid);
    //   });
    // } else {
    //   this.uid = user.user.uid;
    //   this.getUserWatchList(this.uid);
    // }
  }

  //   initStorage(res: UserCredential) {
  //     if (this.uids.some((uid) => uid == res.user.uid)) {
  //       this.getUserWatchList(res.user.uid);
  //       return;
  //     }

  //     this.db.collection<User>('users').doc(res.user.uid).set({
  //       displayName: res.user.displayName,
  //       emailVerified: res.user.emailVerified,
  //       watchList: [],
  //     });
  //   }

  getUsersUid() {
    this.usersDatabase.get().subscribe((data) => {
      data.docs.forEach((doc) => {
        this.uids.push(doc.id);
      });
    });
  }

  getUserWatchList(uid) {
    this.usersDatabase
      .doc(uid)
      .get()
      .subscribe((data) => {
        localStorage.setItem('liked', JSON.stringify(data.data().watchList));
      });
  }
}
