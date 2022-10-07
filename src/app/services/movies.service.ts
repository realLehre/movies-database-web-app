import { Injectable } from '@angular/core';
import { Subject, take } from 'rxjs';
import { MovieObject, RefinedResponse } from '../shared/movie.model';

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

  likedMovies: MovieObject[] = [];
  likedMoviesObs = new Subject<MovieObject[]>();

  pageWidth = new Subject<number>();

  constructor() {
    if (JSON.parse(localStorage.getItem('liked')) != null) {
      this.likedMovies = JSON.parse(localStorage.getItem('liked'));
    } else {
      this.likedMovies = [];
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
    if (this.likedMovies != null) {
      if (this.likedMovies.some((item) => item.id == id)) {
        return;
      }
    }

    this.likedMovies.push(movie);

    localStorage.setItem('liked', JSON.stringify(this.likedMovies));

    this.likedMoviesObs.next(this.likedMovies);
    this.likedMoviesObs.subscribe((data) => {
      localStorage.setItem('liked', JSON.stringify(data));
    });
  }

  onDisLike(id: number) {
    this.likedMovies.filter((movie, index) => {
      if (id == movie.id) {
        this.likedMovies.splice(index, 1);
      }
    });

    localStorage.setItem('liked', JSON.stringify(this.likedMovies));

    this.likedMoviesObs.next(this.likedMovies);
    this.likedMoviesObs.subscribe((data) => {
      localStorage.setItem('liked', JSON.stringify(data));
    });
  }

  getLikedMovies() {
    if (JSON.parse(localStorage.getItem('liked')) != null) {
      return JSON.parse(localStorage.getItem('liked'));
    } else {
      return [];
    }
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
