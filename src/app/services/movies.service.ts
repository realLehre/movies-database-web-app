import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { MovieObject, RefinedResponse } from '../shared/movie.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { User } from '../shared/user.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  sortValue = new Subject<string>();

  search = new Subject<boolean>();
  searchState: boolean;
  searchName = new Subject<string>();
  searchNames: string[] = [];
  moviesSearch = new Subject<RefinedResponse>();
  searching = new Subject<boolean>();

  searchResults = new Subject<RefinedResponse>();
  searchKeyword = new Subject<boolean>();
  clearSearch = new Subject<boolean>();

  isLoading = new Subject<boolean>();
  isFetching = new Subject<boolean>();

  errorOcurred = new Subject<boolean>();

  // likedMovies: MovieObject[] = [];
  likedMoviesObs = new Subject<MovieObject[]>();

  pageWidth = new Subject<number>();

  usersDatabase: AngularFirestoreCollection<User>;
  uid: string;
  currentWatchList: MovieObject[] = [];
  userWatchList = new Subject<MovieObject[]>();

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) {
    this.usersDatabase = this.db.collection('users');

    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user.user.uid);
    if (JSON.parse(localStorage.getItem('user')) != null) {
      this.uid = JSON.parse(localStorage.getItem('user')).user.uid;
      this.getUserWatchList();
    } else {
      // this.authService.userId.subscribe((data) => {
      //   this.uid = data;
      //   this.getUserWatchList();
      // });
    }

    if (JSON.parse(localStorage.getItem('searchNames')) != null) {
      this.searchNames = JSON.parse(localStorage.getItem('searchNames'));
    } else {
      this.searchNames = [];
      localStorage.setItem('searchNames', JSON.stringify(this.searchNames));
    }
  }

  searchResult(state: boolean) {
    this.searchState = state;
  }

  searchedMovies(movies: RefinedResponse) {
    return this.moviesSearch.next(movies);
  }

  getSearchNames() {
    this.searchName.pipe(take(1)).subscribe((name) => {
      if (JSON.parse(localStorage.getItem('searchNames')).includes(name)) {
        return;
      }
      this.searchNames.unshift(name);

      localStorage.setItem('searchNames', JSON.stringify(this.searchNames));
    });
  }

  removeSearchName(index) {
    this.searchNames.splice(index, 1);
    localStorage.setItem('searchNames', JSON.stringify(this.searchNames));
  }

  onLike(movie: MovieObject, id: number) {
    let prevWatchList = [];
    console.log(this.uid);

    if (this.uid == null) {
      this.authService.userId
        .pipe(switchMap((uid) => this.usersDatabase.doc(uid).get()))
        .subscribe((data) => {
          prevWatchList = data.data().watchList;
          console.log('null uid', prevWatchList);

          if (prevWatchList.length == 0) {
            this.usersDatabase.doc(this.uid).update({ watchList: [movie] });
          }

          if (prevWatchList.some((movie) => movie.id == id)) {
            return;
          }

          this.usersDatabase
            .doc(this.uid)
            .update({ watchList: [...prevWatchList, movie] });

          localStorage.setItem(
            'liked',
            JSON.stringify([...prevWatchList, movie])
          );
          this.emitUserWatchList([...prevWatchList, movie]);

          this.getUserWatchList();
        });
    } else {
      this.usersDatabase
        .doc(this.uid)
        .get()
        .subscribe((data) => {
          prevWatchList = data.data().watchList;
          console.log('uid', prevWatchList);

          if (prevWatchList.length == 0) {
            this.usersDatabase.doc(this.uid).update({ watchList: [movie] });
          }

          if (prevWatchList.some((movie) => movie.id == id)) {
            return;
          }

          this.usersDatabase
            .doc(this.uid)
            .update({ watchList: [...prevWatchList, movie] });

          localStorage.setItem(
            'liked',
            JSON.stringify([...prevWatchList, movie])
          );
          this.emitUserWatchList([...prevWatchList, movie]);

          this.getUserWatchList();
        });
    }

    // if (this.likedMovies != null) {
    //   if (this.likedMovies.some((item) => item.id == id)) {
    //     return;
    //   }
    // }

    // this.likedMovies.push(movie);
  }

  onDisLike(id: number) {
    let prevWatchList = [];

    this.usersDatabase
      .doc(this.uid)
      .get()
      .subscribe((userData) => {
        prevWatchList = userData.data().watchList;

        prevWatchList.filter((movie, index) => {
          if (id == movie.id) {
            prevWatchList.splice(index, 1);
          }
        });

        this.usersDatabase
          .doc(this.uid)
          .update({ watchList: [...prevWatchList] });

        this.emitUserWatchList([...prevWatchList]);

        localStorage.setItem('liked', JSON.stringify([...prevWatchList]));

        this.getUserWatchList();
      });
  }

  clearWatchList() {
    localStorage.setItem('liked', null);
    this.usersDatabase.doc(this.uid).update({ watchList: [] });
  }

  getUserWatchList() {
    this.usersDatabase
      .doc(this.uid)
      .get()
      .subscribe((userData) => {
        this.currentWatchList = userData.data().watchList;
      });
  }

  getForComponent() {
    return this.usersDatabase.doc(this.uid).get();
  }

  emitUserWatchList(watchList: MovieObject[]) {
    this.userWatchList.next(watchList);
  }

  getLikedMovies() {
    if (JSON.parse(localStorage.getItem('liked')) != null) {
      return JSON.parse(localStorage.getItem('liked'));
    } else {
      return [];
    }
  }

  getLiked(): RefinedResponse {
    const likedMoviesS = JSON.parse(localStorage.getItem('liked'));

    let refinedData: RefinedResponse;

    const paths = [];
    for (const key in likedMoviesS) {
      paths.push(
        'https://image.tmdb.org/t/p/original' + likedMoviesS[key].poster_path
      );
    }

    const ratings = [];
    for (const key in likedMoviesS) {
      if (Number.isInteger(likedMoviesS[key].vote_average)) {
        ratings.push(likedMoviesS[key].vote_average);
      } else {
        ratings.push(Math.floor(likedMoviesS[key].vote_average * 10));
      }
    }

    const ids = [];
    for (const key in likedMoviesS) {
      ids.push(likedMoviesS[key].id);
    }

    const names = [];
    for (const key in likedMoviesS) {
      names.push(likedMoviesS[key].original_title.replace(/\s+/g, ''));
    }

    refinedData = {
      movies: likedMoviesS,
      moviePosterPaths: paths,
      movieRatings: ratings,
      movieIds: ids,
      movieNames: names,
    };

    return refinedData;
  }
}
