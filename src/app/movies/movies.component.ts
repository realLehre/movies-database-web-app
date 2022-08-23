import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpService } from '../services/http.service';

import { MoviesService } from '../services/movies.service';
import { MovieObject } from '../shared/movie.model';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MoviesComponent implements OnInit {
  trendingMovies: Array<MovieObject>;
  trendingMoviesRating: Array<number>;
  trendingMoviesPoster: string[];

  popularMovies: Array<MovieObject>;
  popularMoviesRating: Array<number>;
  popularMoviesPoster: string[];

  topRatedMovies: Array<MovieObject>;
  topRatedMoviesRating: Array<number>;
  topRatedMoviesPoster: string[];

  constructor(
    private movieService: MoviesService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.httpService.getTrending().subscribe((data) => {
      this.trendingMovies = data.results;

      const paths = [];
      for (const key in this.trendingMovies) {
        paths.push(
          'https://image.tmdb.org/t/p/original' +
            this.trendingMovies[key].poster_path
        );
      }
      this.trendingMoviesPoster = paths;

      const ratings = [];
      for (const key in this.trendingMovies) {
        ratings.push(Math.floor(this.trendingMovies[key].vote_average * 10));
      }
      this.trendingMoviesRating = ratings;
    });

    this.httpService.getPopular().subscribe((data) => {
      this.popularMovies = data.results;

      const paths = [];
      for (const key in this.popularMovies) {
        paths.push(
          'https://image.tmdb.org/t/p/original' +
            this.popularMovies[key].poster_path
        );
      }
      this.popularMoviesPoster = paths;

      const ratings = [];
      for (const key in this.popularMovies) {
        ratings.push(Math.floor(this.popularMovies[key].vote_average * 10));
      }
      this.popularMoviesRating = ratings;
    });

    this.httpService.getTopRated().subscribe((data) => {
      this.topRatedMovies = data.results;

      const paths = [];
      for (const key in this.topRatedMovies) {
        paths.push(
          'https://image.tmdb.org/t/p/original' +
            this.topRatedMovies[key].poster_path
        );
      }
      this.topRatedMoviesPoster = paths;

      const ratings = [];
      for (const key in this.topRatedMovies) {
        ratings.push(Math.floor(this.topRatedMovies[key].vote_average * 10));
      }
      this.topRatedMoviesRating = ratings;
    });
  }

  ratingColor(rating: number): string {
    if (rating < 51) {
      return '#DC143C';
    } else if (rating < 71) {
      return 'yellow';
    } else {
      return 'green';
    }
  }
}
