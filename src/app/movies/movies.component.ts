import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';

import { MoviesService } from '../services/movies.service';
import { MovieObject, Response } from '../shared/movie.model';

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
  trendingMoviesId: number[];

  popularMovies: Array<MovieObject>;
  popularMoviesRating: Array<number>;
  popularMoviesPoster: string[];
  popularMoviesId: number[];

  topRatedMovies: Array<MovieObject>;
  topRatedMoviesRating: Array<number>;
  topRatedMoviesPoster: string[];
  topRatedMoviesId: number[];

  searchState: boolean;
  searchName: string;
  searchMovies: Array<MovieObject>;
  searchMoviesRating: Array<number>;
  searchMoviesPoster: string[];
  searchMoviesId: number[];

  constructor(
    private moviesService: MoviesService,
    private httpService: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Trending
    this.httpService.getTrending().subscribe((data) => {
      this.trendingMovies = data.results;

      this.trendingMoviesPoster = this.moviesPoster(
        this.trendingMovies,
        this.trendingMoviesPoster
      );

      this.trendingMoviesRating = this.moviesRating(
        this.trendingMovies,
        this.trendingMoviesRating
      );

      this.trendingMoviesId = this.moviesId(
        this.trendingMovies,
        this.trendingMoviesId
      );
    });

    // Popular
    this.httpService.getPopular().subscribe((data) => {
      this.popularMovies = data.results;

      this.popularMoviesPoster = this.moviesPoster(
        this.popularMovies,
        this.popularMoviesPoster
      );

      this.popularMoviesRating = this.moviesRating(
        this.popularMovies,
        this.popularMoviesRating
      );

      this.popularMoviesId = this.moviesId(
        this.popularMovies,
        this.popularMoviesId
      );
    });

    // Top rated
    this.httpService.getTopRated().subscribe((data) => {
      this.topRatedMovies = data.results;

      this.topRatedMoviesPoster = this.moviesPoster(
        this.topRatedMovies,
        this.topRatedMoviesPoster
      );

      this.topRatedMoviesRating = this.moviesRating(
        this.topRatedMovies,
        this.topRatedMoviesRating
      );

      this.topRatedMoviesId = this.moviesId(
        this.topRatedMovies,
        this.topRatedMoviesId
      );
    });

    // search
    if (localStorage.getItem('Movies')) {
      const movies = JSON.parse(localStorage.getItem('Movies'));
      this.searchMoviesFunc(movies);
    }

    this.moviesService.moviesSearch.subscribe((movies) => {
      this.searchMoviesFunc(movies);
    });

    this.searchState = this.moviesService.searchState;
  }

  moviesPoster(movieType, moviePoster) {
    const paths = [];
    for (const key in movieType) {
      paths.push(
        'https://image.tmdb.org/t/p/original' + movieType[key].poster_path
      );
    }
    moviePoster = paths;
    return moviePoster;
  }

  moviesRating(movieType, movieRating) {
    const ratings = [];
    for (const key in movieType) {
      ratings.push(Math.floor(movieType[key].vote_average * 10));
    }
    movieRating = ratings;

    return movieRating;
  }

  moviesId(movieType, movieId) {
    const ids = [];
    for (const key in movieType) {
      ids.push(movieType[key].id);
    }
    movieId = ids;

    return movieId;
  }

  searchMoviesFunc(movies) {
    this.searchMovies = movies;
    localStorage.setItem('Movies', JSON.stringify(movies));

    const paths = [];
    for (const key in this.searchMovies) {
      paths.push(
        'https://image.tmdb.org/t/p/original' +
          this.searchMovies[key].poster_path
      );
    }
    this.searchMoviesPoster = paths;

    const ratings = [];
    for (const key in this.searchMovies) {
      ratings.push(Math.floor(this.searchMovies[key].vote_average * 10));
    }
    this.searchMoviesRating = ratings;

    const ids = [];
    for (const key in this.searchMovies) {
      ids.push(this.searchMovies[key].id);
    }
    this.searchMoviesId = ids;

    this.moviesService.searchName.subscribe((name) => {
      this.searchName = name;
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
