import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
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

      const ids = [];
      for (const key in this.trendingMovies) {
        ids.push(this.trendingMovies[key].id);
      }
      this.trendingMoviesId = ids;
    });

    // Popular
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

      const ids = [];
      for (const key in this.popularMovies) {
        ids.push(this.popularMovies[key].id);
      }
      this.popularMoviesId = ids;
    });

    // Top rated
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

      const ids = [];
      for (const key in this.topRatedMovies) {
        ids.push(this.topRatedMovies[key].id);
      }
      this.topRatedMoviesId = ids;
    });

    // search
    if (localStorage.getItem('Movies')) {
      this.searchMovies = JSON.parse(localStorage.getItem('Movies'));

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

    this.moviesService.moviesSearch.subscribe((movies) => {
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
    });

    this.searchState = this.moviesService.searchState;
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
