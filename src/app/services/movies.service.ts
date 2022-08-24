import { getLocaleMonthNames } from '@angular/common';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MovieObject } from '../shared/movie.model';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  trendingMovies: MovieObject[];
  popularMovies: MovieObject[] = [];
  topRatedMovies: MovieObject[] = [];

  search = new Subject<boolean>();
  searchState: boolean;
  searchName = new Subject<string>();
  moviesSearch = new Subject<MovieObject[]>();

  constructor(private httpService: HttpService) {}

  searchResult(state: boolean) {
    this.searchState = state;
  }

  searchedMovies(movies: MovieObject[]) {
    return this.moviesSearch.next(movies);
    console.log(this.moviesSearch);
  }
}
