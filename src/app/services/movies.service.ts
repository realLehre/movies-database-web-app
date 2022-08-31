import { getLocaleMonthNames } from '@angular/common';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MovieObject, RefinedResponse } from '../shared/movie.model';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  trendingMovies: MovieObject[];
  popularMovies: MovieObject[] = [];
  topRatedMovies: MovieObject[] = [];

  search = new Subject<boolean>();
  searchState: boolean;
  searchName = new Subject<string>();
  moviesSearch = new Subject<RefinedResponse>();

  isLoading = new Subject<boolean>();

  constructor() {}

  searchResult(state: boolean) {
    this.searchState = state;
  }

  searchedMovies(movies: RefinedResponse) {
    return this.moviesSearch.next(movies);
  }
}
