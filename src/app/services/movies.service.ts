import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MovieObject, RefinedResponse } from '../shared/movie.model';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  sortValue = new Subject<string>();

  search = new Subject<boolean>();
  searchState: boolean;
  searchName = new Subject<string>();
  moviesSearch = new Subject<RefinedResponse>();

  isLoading = new Subject<boolean>();

  favorite: MovieObject[] = [];

  isLiked = new Subject<boolean>();
  // isLiked = new BehaviorSubject<boolean>(true);
  likedMovies: MovieObject[] = [];
  likedMoviesObs = new Subject<MovieObject[]>();
  isAlreadyLiked: boolean = false;

  isFetching = new Subject<boolean>();

  constructor() {}

  searchResult(state: boolean) {
    this.searchState = state;
  }

  searchedMovies(movies: RefinedResponse) {
    return this.moviesSearch.next(movies);
  }

  onLike(movie: MovieObject, id: number) {
    this.isLiked.subscribe((state) => {
      console.log(state);
    });
    if (!this.likedMovies.some((item) => item.id == id)) {
      this.likedMovies.push(movie);
      this.likedMoviesObs.next(this.likedMovies);
      this.likedMoviesObs.subscribe((data) => {
        localStorage.setItem('liked', JSON.stringify(data));
        console.log(data);
      });
    }
  }

  onDisLike(id: number) {
    this.likedMovies.filter((movie, index) => {
      if (id == movie.id) {
        this.likedMovies.splice(index, 1);
      }
    });
    this.likedMoviesObs.next(this.likedMovies);
    this.likedMoviesObs.subscribe((data) => {
      localStorage.setItem('liked', JSON.stringify(data));
      console.log(data);
    });
  }

  getLiked() {
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
      ratings.push(Math.floor(likedMoviesS[key].vote_average * 10));
    }

    const ids = [];
    for (const key in likedMoviesS) {
      ids.push(likedMoviesS[key].id);
    }

    refinedData = {
      movies: likedMoviesS,
      moviePosterPaths: paths,
      movieRatings: ratings,
      movieIds: ids,
    };

    return refinedData;
  }
}
