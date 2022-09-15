import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';

import { MoviesService } from '../services/movies.service';
import { MovieObject } from '../shared/movie.model';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit, AfterViewInit {
  sortValue: string = 'all';
  error: boolean = false;

  trendingMovies: Array<MovieObject>;
  trendingMoviesRating: Array<number>;
  trendingMoviesPoster: string[];
  trendingMoviesId: number[];
  trendingMoviesNames: string[];

  popularMovies: Array<MovieObject>;
  popularMoviesRating: Array<number>;
  popularMoviesPoster: string[];
  popularMoviesId: number[];
  popularMoviesNames: string[];

  popularMovies_2: Array<MovieObject>;
  popularMoviesRating_2: Array<number>;
  popularMoviesPoster_2: string[];
  popularMoviesId_2: number[];
  popularMoviesNames_2: string[];

  topRatedMovies: Array<MovieObject>;
  topRatedMoviesRating: Array<number>;
  topRatedMoviesPoster: string[];
  topRatedMoviesId: number[];
  topRatedMoviesNames: string[];

  topRatedMovies_2: Array<MovieObject>;
  topRatedMovies_2Rating: Array<number>;
  topRatedMovies_2Poster: string[];
  topRatedMovies_2Id: number[];
  topRatedMovies_2Names: string[];

  searchState: boolean;
  searchName: string;
  searchMovies: Array<MovieObject>;
  searchMoviesRating: Array<number>;
  searchMoviesPoster: string[];
  searchMoviesId: number[];
  searchMoviesNames: string[];

  isFetching: boolean = false;

  @ViewChild('like', { static: false }) likedEl: ElementRef<HTMLDivElement>;

  constructor(
    private moviesService: MoviesService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.moviesService.isFetching.next(this.isFetching);

    const likedMoviesTest = this.moviesService.getLikedMovies();

    // Trending
    this.httpService.getTrending().subscribe({
      next: (movieData) => {
        this.trendingMovies = movieData.movies;
        localStorage.setItem('trending', JSON.stringify(this.trendingMovies));
        // console.log(this.trendingMovies);

        this.trendingMoviesPoster = movieData.moviePosterPaths;
        this.trendingMoviesRating = movieData.movieRatings;
        this.trendingMoviesId = movieData.movieIds;
        this.trendingMoviesNames = movieData.movieNames;

        this.trendingMovies.forEach((movie) => {
          if (likedMoviesTest.some((item) => item.id == movie.id)) {
            movie['liked'] = true;
          }
        });
      },
      error: (err) => {
        if (err) {
          this.error = true;
          this.isFetching = false;
          this.moviesService.isFetching.next(this.isFetching);
        }
      },
    });

    // Popular
    this.httpService.getPopular().subscribe({
      next: (movieData) => {
        this.popularMovies = movieData.movies;
        localStorage.setItem('popular', JSON.stringify(this.popularMovies));
        this.popularMoviesPoster = movieData.moviePosterPaths;
        this.popularMoviesRating = movieData.movieRatings;
        this.popularMoviesId = movieData.movieIds;
        this.popularMoviesNames = movieData.movieNames;

        this.popularMovies.forEach((movie) => {
          if (likedMoviesTest.some((item) => item.id == movie.id)) {
            movie['liked'] = true;
          }
        });
      },
      error: (err) => {
        if (err) {
          this.error = true;
          this.isFetching = false;
          this.moviesService.isFetching.next(this.isFetching);
        }
      },
    });
    this.httpService.getPopular_2().subscribe({
      next: (movieData) => {
        this.popularMovies_2 = movieData.movies;
        localStorage.setItem('popular_2', JSON.stringify(this.popularMovies_2));
        this.popularMoviesPoster_2 = movieData.moviePosterPaths;
        this.popularMoviesRating_2 = movieData.movieRatings;
        this.popularMoviesId_2 = movieData.movieIds;
        this.popularMoviesNames_2 = movieData.movieNames;

        this.popularMovies_2.forEach((movie) => {
          if (likedMoviesTest.some((item) => item.id == movie.id)) {
            movie['liked'] = true;
          }
        });
      },
      error: (err) => {
        if (err) {
          this.error = true;
          this.isFetching = false;
          this.moviesService.isFetching.next(this.isFetching);
        }
      },
    });

    // Top rated
    this.httpService.getTopRated().subscribe({
      next: (movieData) => {
        this.isFetching = false;
        this.moviesService.isFetching.next(this.isFetching);
        this.topRatedMovies = movieData.movies;
        localStorage.setItem('topRated', JSON.stringify(this.topRatedMovies));
        this.topRatedMoviesPoster = movieData.moviePosterPaths;
        this.topRatedMoviesRating = movieData.movieRatings;
        this.topRatedMoviesId = movieData.movieIds;
        this.topRatedMoviesNames = movieData.movieNames;

        this.topRatedMovies.forEach((movie) => {
          if (likedMoviesTest.some((item) => item.id == movie.id)) {
            movie['liked'] = true;
          }
        });
      },
      error: (err) => {
        if (err) {
          this.error = true;
          this.isFetching = false;
          this.moviesService.isFetching.next(this.isFetching);
        }
      },
    });

    this.httpService.getTopRated_2().subscribe({
      next: (movieData) => {
        this.isFetching = false;
        this.moviesService.isFetching.next(this.isFetching);
        this.topRatedMovies_2 = movieData.movies;
        this.topRatedMovies_2Poster = movieData.moviePosterPaths;
        this.topRatedMovies_2Rating = movieData.movieRatings;
        this.topRatedMovies_2Id = movieData.movieIds;
        this.topRatedMovies_2Names = movieData.movieNames;

        this.topRatedMovies_2.forEach((movie) => {
          if (likedMoviesTest.some((item) => item.id == movie.id)) {
            movie['liked'] = true;
          }
        });
      },
      error: (err) => {
        if (err) {
          this.error = true;
          this.isFetching = false;
          this.moviesService.isFetching.next(this.isFetching);
        }
      },
    });

    // search
    if (localStorage.getItem('Movies')) {
      const movies = JSON.parse(localStorage.getItem('Movies'));

      this.searchMovies = movies.movies;
      this.searchMoviesPoster = movies.moviePosterPaths;
      this.searchMoviesRating = movies.movieRatings;
      this.searchMoviesId = movies.movieIds;
      this.searchMoviesNames = movies.movieNames;

      this.searchMovies.forEach((movie) => {
        if (likedMoviesTest.some((item) => item.id == movie.id)) {
          movie['liked'] = true;
        }
      });
    }

    if (localStorage.getItem('searchName')) {
      const name = JSON.parse(localStorage.getItem('searchName'));
      this.searchName = name;
    }

    this.moviesService.moviesSearch.subscribe({
      next: (movies) => {
        localStorage.setItem('Movies', JSON.stringify(movies));

        this.searchMovies = movies.movies;
        this.searchMoviesPoster = movies.moviePosterPaths;
        this.searchMoviesRating = movies.movieRatings;
        this.searchMoviesId = movies.movieIds;
        this.searchMoviesNames = movies.movieNames;

        this.moviesService.searchName.subscribe((name) => {
          this.searchName = name;
          localStorage.setItem('searchName', JSON.stringify(name));
        });
      },
    });

    this.searchState = this.moviesService.searchState;

    this.moviesService.sortValue.subscribe({
      next: (value) => {
        this.sortValue = value;
      },
    });

    this.moviesService.sortValue.subscribe({
      next: (value) => {
        this.sortValue = value;

        if (value == 'action') {
          this.trendingMovies.filter((movie, index) => {
            for (const key in movie['genre_ids']) {
              if (movie['genre_ids'][key] !== 28) {
                this.trendingMovies.splice(index, 1);
                console.log(this.trendingMovies);
              }
            }
          });
          this.popularMovies.filter((movie, index) => {
            for (const key in movie['genre_ids']) {
              if (movie['genre_ids'][key] !== 28) {
                this.popularMovies.splice(index, 1);
              }
            }
          });
          this.popularMovies_2.filter((movie, index) => {
            for (const key in movie['genre_ids']) {
              if (movie['genre_ids'][key] !== 28) {
                this.popularMovies_2.splice(index, 1);
              }
            }
          });
          this.topRatedMovies.filter((movie, index) => {
            for (const key in movie['genre_ids']) {
              if (movie['genre_ids'][key] !== 28) {
                this.topRatedMovies.splice(index, 1);
              }
            }
          });
        }
        if (value == 'drama') {
          this.trendingMovies.filter((movie, index) => {
            for (const key in movie['genre_ids']) {
              if (movie['genre_ids'][key] !== 18) {
                this.trendingMovies.splice(index, 1);
              }
            }
          });
          this.popularMovies.filter((movie, index) => {
            for (const key in movie['genre_ids']) {
              if (movie['genre_ids'][key] !== 18) {
                this.popularMovies.splice(index, 1);
              }
            }
          });
          this.popularMovies_2.filter((movie, index) => {
            for (const key in movie['genre_ids']) {
              if (movie['genre_ids'][key] !== 18) {
                this.popularMovies_2.splice(index, 1);
              }
            }
          });
          this.topRatedMovies.filter((movie, index) => {
            for (const key in movie['genre_ids']) {
              if (movie['genre_ids'][key] !== 18) {
                this.topRatedMovies.splice(index, 1);
              }
            }
          });
        }

        if (value != 'action') {
          this.trendingMovies = JSON.parse(localStorage.getItem('trending'));
          this.popularMovies = JSON.parse(localStorage.getItem('popular'));
          this.popularMovies_2 = JSON.parse(localStorage.getItem('popular'));
          this.topRatedMovies = JSON.parse(localStorage.getItem('topRated'));
        }
      },
    });
  }

  ngAfterViewInit(): void {}

  addToLiked(e, id, movie) {
    movie['liked'] = !movie['liked'];

    const movieContainer = e.target.parentElement.parentElement;

    if (movie['liked'] == true) {
      this.moviesService.onLike(movie, id);

      movieContainer.classList.add('showAdd');

      setTimeout(() => {
        movieContainer.classList.remove('showAdd');
      }, 650);
    } else {
      this.moviesService.onDisLike(id);

      movieContainer.classList.add('showRemove');
      setTimeout(() => {
        movieContainer.classList.remove('showRemove');
      }, 650);
    }
  }

  ratingColor(rating: number): string {
    return this.moviesService.ratingColor(rating);
  }
}
