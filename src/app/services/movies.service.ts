import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { MovieObject, RefinedResponse } from '../shared/movie.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { User } from '../shared/user.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  sortValue = new Subject<string>();

  search = new Subject<boolean>();
  searchState: boolean;
  searchName = new Subject<string>();
  searchNames: string[] = [];
  searchedMoviesStored: MovieObject[] = [];
  moviesSearch = new Subject<RefinedResponse>();
  searching = new Subject<boolean>();

  searchResults = new Subject<RefinedResponse>();
  searchKeyword = new Subject<boolean>();
  clearSearch = new Subject<boolean>();

  isLoading = new Subject<boolean>();
  isFetching = new Subject<boolean>();

  errorOcurred = new Subject<boolean>();

  likedMoviesObs = new Subject<MovieObject[]>();

  pageWidth = new Subject<number>();

  usersDatabase: AngularFirestoreCollection<User>;
  uid: string;
  currentWatchList: MovieObject[] = [];
  userWatchList = new Subject<MovieObject[]>();

  constructor(private db: AngularFirestore, private authService: AuthService) {
    this.usersDatabase = this.db.collection('users');

    const user = JSON.parse(localStorage.getItem('user'));

    if (JSON.parse(localStorage.getItem('user')) != null) {
      this.uid = JSON.parse(localStorage.getItem('user')).user.uid;
      this.getUserWatchList();
    }
    this.authService.userId.subscribe((data) => {
      this.uid = data;
      this.getUserWatchList();
    });

    if (JSON.parse(localStorage.getItem('searchNames')) != null) {
      this.searchNames = JSON.parse(localStorage.getItem('searchNames'));
    } else {
      this.searchNames = [];
      localStorage.setItem('searchNames', JSON.stringify(this.searchNames));
    }

    if (JSON.parse(localStorage.getItem('searchedMovies')) != null) {
      this.searchedMoviesStored = JSON.parse(
        localStorage.getItem('searchedMovies')
      );
    } else {
      localStorage.setItem('searchedMovies', null);
    }
  }

  searchResult(state: boolean) {
    this.searchState = state;
  }

  searchedMovies(movies: RefinedResponse) {
    this.moviesSearch.next(movies);

    localStorage.setItem('searchedMovies', JSON.stringify(movies));
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
    const uid = JSON.parse(localStorage.getItem('user')).user.uid;

    const prevWatchListInStorage = JSON.parse(localStorage.getItem('liked'));

    if (prevWatchListInStorage.some((movie) => movie.id == id)) {
      return;
    }

    prevWatchListInStorage.push(movie);

    localStorage.setItem('liked', JSON.stringify(prevWatchListInStorage));
    this.userWatchList.next(prevWatchListInStorage);
    this.getUserWatchList();
    this.usersDatabase.doc(uid).update({ watchList: prevWatchListInStorage });
  }

  onDisLike(id: number) {
    const uid = JSON.parse(localStorage.getItem('user')).user.uid;

    const prevWatchListInStorage = JSON.parse(localStorage.getItem('liked'));

    if (prevWatchListInStorage.length != 0) {
      prevWatchListInStorage.filter((movie, index) => {
        if (id == movie.id) {
          prevWatchListInStorage.splice(index, 1);
        }
      });
    }

    localStorage.setItem('liked', JSON.stringify(prevWatchListInStorage));
    this.userWatchList.next(prevWatchListInStorage);

    this.getUserWatchList();
    this.usersDatabase
      .doc(uid)
      .update({ watchList: [...prevWatchListInStorage] });
  }

  clearWatchList() {
    localStorage.setItem('liked', null);
    this.usersDatabase.doc(this.uid).update({ watchList: [] });
    this.userWatchList.next(null);
  }

  getUserWatchList() {
    const uid = JSON.parse(localStorage.getItem('user')).user.uid;
    this.usersDatabase
      .doc(uid)
      .get()
      .subscribe((userData) => {
        if (
          userData.data().watchList != null ||
          userData.data().watchList != undefined
        ) {
          this.currentWatchList = userData.data().watchList;
          localStorage.setItem('liked', JSON.stringify(this.currentWatchList));
          this.userWatchList.next(this.currentWatchList);
        }
      });
  }

  getForComponent() {
    const uid = JSON.parse(localStorage.getItem('user')).user.uid;

    return this.usersDatabase.doc(uid).get();
  }

  getLikedMovies() {
    if (JSON.parse(localStorage.getItem('liked')) != null) {
      return JSON.parse(localStorage.getItem('liked'));
      // return this.usersDatabase
      //   .doc(this.uid)
      //   .get()
      //   .subscribe((userData) => {
      //     this.currentWatchList = userData.data().watchList;
      //     return this.clearWatchList;
      //   });
    } else {
      return [];
    }

    // this.usersDatabase
    //   .doc(this.uid)
    //   .get()
    //   .subscribe((userData) => {
    //     this.currentWatchList = userData.data().watchList;
    //     return this.clearWatchList
    //   });
  }

  getWatchList(): RefinedResponse {
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

    // return this.usersDatabase
    //   .doc(this.uid)
    //   .get()
    //   .pipe(
    //     map((userData) => {
    //       const likedMoviesS = userData.data().watchList;

    //       let refinedData: RefinedResponse;

    //       const paths = [];
    //       for (const key in likedMoviesS) {
    //         paths.push(
    //           'https://image.tmdb.org/t/p/original' +
    //             likedMoviesS[key].poster_path
    //         );
    //       }

    //       const ratings = [];
    //       for (const key in likedMoviesS) {
    //         if (Number.isInteger(likedMoviesS[key].vote_average)) {
    //           ratings.push(likedMoviesS[key].vote_average);
    //         } else {
    //           ratings.push(Math.floor(likedMoviesS[key].vote_average * 10));
    //         }
    //       }

    //       const ids = [];
    //       for (const key in likedMoviesS) {
    //         ids.push(likedMoviesS[key].id);
    //       }

    //       const names = [];
    //       for (const key in likedMoviesS) {
    //         names.push(likedMoviesS[key].original_title.replace(/\s+/g, ''));
    //       }

    //       refinedData = {
    //         movies: likedMoviesS,
    //         moviePosterPaths: paths,
    //         movieRatings: ratings,
    //         movieIds: ids,
    //         movieNames: names,
    //       };

    //       return refinedData;
    //     })
    //   );
  }
}
