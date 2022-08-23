import { getLocaleMonthNames } from '@angular/common';
import { Injectable } from '@angular/core';
import { MovieObject } from '../shared/movie.model';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  trendingMovies: MovieObject[];
  popularMovies: MovieObject[] = [];
  topRatedMovies: MovieObject[] = [];

  constructor(private httpService: HttpService) {}

  showTrendingMovies() {}

  getTrendingMovies() {
    console.log(this.trendingMovies);
  }
}
