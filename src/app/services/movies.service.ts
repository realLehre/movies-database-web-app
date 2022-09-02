import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MovieObject, RefinedResponse } from '../shared/movie.model';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  trendingMovies: MovieObject[] = [];
  popularMovies: MovieObject[] = [];
  topRatedMovies: MovieObject[] = [];

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
  // likedMoviesObs = new BehaviorSubject<MovieObject[]>(this.likedMovies);

  constructor() {}

  searchResult(state: boolean) {
    this.searchState = state;
  }

  searchedMovies(movies: RefinedResponse) {
    return this.moviesSearch.next(movies);
  }

  onLike(movie: MovieObject) {}

  onDisLike(index: number) {}

  getLiked() {
    const likedMoviesS = JSON.parse(localStorage.getItem('liked'));
    //  this.likedMoviesObs.subscribe((data) => {
    //    console.log(data);
    //    localStorage.setItem('liked', JSON.stringify(data));
    //  });

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

    // localStorage.setItem('liked', JSON.stringify(refinedData));

    return refinedData;
  }
}
