import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';
import SwiperCore, {
  Navigation,
  Pagination,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
  Keyboard,
  SwiperOptions,
} from 'swiper';

SwiperCore.use([
  Keyboard,
  Pagination,
  Navigation,
  Virtual,
  Autoplay,
  Thumbs,
  Controller,
]);

import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { MoviesService } from 'src/app/services/movies.service';
import { MovieObject, RefinedResponse } from 'src/app/shared/movie.model';

@Component({
  selector: 'app-movie-type',
  templateUrl: './movie-type.component.html',
  styleUrls: ['./movie-type.component.scss'],
})
export class MovieTypeComponent implements OnInit, AfterViewChecked {
  @Input() movieType: string;

  movies: Array<MovieObject> = [];
  moviesRating: Array<number>;
  moviesPoster: string[];
  moviesId: number[];
  moviesNames: string[];
  moviesStored: RefinedResponse;
  watchList: MovieObject[] = [];
  recentMovies: RefinedResponse;

  error: boolean;
  isFetching: boolean = true;
  sortValue: string;

  searchState: boolean;

  movieRatingColor: string;

  config: SwiperOptions = {
    loop: true,
    navigation: true,
    keyboard: {
      enabled: true,
    },
    speed: 1000,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    preloadImages: false,
    lazy: true,
  };

  constructor(
    private moviesService: MoviesService,
    private httpService: HttpService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.moviesService.isFetching.next(this.isFetching);

    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      this.moviesService.getForComponent().subscribe((userData) => {
        this.watchList = userData.data()?.watchList;
        this.getMovies();
      });
    } else {
      this.watchList = this.moviesService.getLikedMovies();
      this.getMovies();
    }

    this.authService.clearWatchList.subscribe((status) => {
      this.watchList = [];
      this.getMovies();
    });

    this.moviesService.sortValue.subscribe({
      next: (value) => {
        this.sortValue = value;

        const filteredMovies = [];
        const moviesPosters = [];
        const moviesIds = [];
        const moviesRatings = [];
        const moviesNames = [];

        switch (value) {
          case 'action':
            this.moviesStored.movies.filter((movie) => {
              for (const key in movie.genre_ids) {
                if (movie.genre_ids[key] == 28) {
                  filteredMovies.push(movie);

                  moviesPosters.push(
                    'https://image.tmdb.org/t/p/original' + movie.poster_path
                  );

                  moviesIds.push(movie.id);

                  moviesRatings.push(Math.floor(movie.vote_average * 10));

                  moviesNames.push(movie.original_title.replace(/\s+/g, ''));
                }
              }
            });
            this.movies = filteredMovies;
            this.moviesPoster = moviesPosters;
            this.moviesId = moviesIds;
            this.moviesNames = moviesNames;
            this.moviesRating = moviesRatings;
            break;

          case 'drama':
            this.moviesStored.movies.filter((movie) => {
              for (const key in movie.genre_ids) {
                if (movie.genre_ids[key] == 18) {
                  filteredMovies.push(movie);

                  moviesPosters.push(
                    'https://image.tmdb.org/t/p/original' + movie.poster_path
                  );

                  moviesIds.push(movie.id);

                  moviesRatings.push(Math.floor(movie.vote_average * 10));

                  moviesNames.push(movie.original_title.replace(/\s+/g, ''));
                }
              }
            });
            this.movies = filteredMovies;
            this.moviesPoster = moviesPosters;
            this.moviesId = moviesIds;
            this.moviesNames = moviesNames;
            this.moviesRating = moviesRatings;
            break;

          case 'crime':
            this.moviesStored.movies.filter((movie) => {
              for (const key in movie.genre_ids) {
                if (movie.genre_ids[key] == 80) {
                  filteredMovies.push(movie);

                  moviesPosters.push(
                    'https://image.tmdb.org/t/p/original' + movie.poster_path
                  );

                  moviesIds.push(movie.id);

                  moviesRatings.push(Math.floor(movie.vote_average * 10));

                  moviesNames.push(movie.original_title.replace(/\s+/g, ''));
                }
              }
            });
            this.movies = filteredMovies;
            this.moviesPoster = moviesPosters;
            this.moviesId = moviesIds;
            this.moviesNames = moviesNames;
            this.moviesRating = moviesRatings;
            break;

          case 'adventure':
            this.moviesStored.movies.filter((movie) => {
              for (const key in movie.genre_ids) {
                if (movie.genre_ids[key] == 12) {
                  filteredMovies.push(movie);

                  moviesPosters.push(
                    'https://image.tmdb.org/t/p/original' + movie.poster_path
                  );

                  moviesIds.push(movie.id);

                  moviesRatings.push(Math.floor(movie.vote_average * 10));

                  moviesNames.push(movie.original_title.replace(/\s+/g, ''));
                }
              }
            });
            this.movies = filteredMovies;
            this.moviesPoster = moviesPosters;
            this.moviesId = moviesIds;
            this.moviesNames = moviesNames;
            this.moviesRating = moviesRatings;
            break;

          case 'horror':
            this.moviesStored.movies.filter((movie) => {
              for (const key in movie.genre_ids) {
                if (movie.genre_ids[key] == 27) {
                  filteredMovies.push(movie);

                  moviesPosters.push(
                    'https://image.tmdb.org/t/p/original' + movie.poster_path
                  );

                  moviesIds.push(movie.id);

                  moviesRatings.push(Math.floor(movie.vote_average * 10));

                  moviesNames.push(movie.original_title.replace(/\s+/g, ''));
                }
              }
            });
            this.movies = filteredMovies;
            this.moviesPoster = moviesPosters;
            this.moviesId = moviesIds;
            this.moviesNames = moviesNames;
            this.moviesRating = moviesRatings;
            break;

          default:
            this.movies = this.moviesStored.movies;
            this.moviesPoster = this.moviesStored.moviePosterPaths;
            this.moviesId = this.moviesStored.movieIds;
            this.moviesNames = this.moviesStored.movieNames;
            this.moviesRating = this.moviesStored.movieRatings;
        }

        // if (
        //   value != 'action' &&
        //   value != 'drama' &&
        //   value != 'crime' &&
        //   value != 'adventure' &&
        //   value != 'horror'
        // ) {
        //   this.movies = this.moviesStored.movies;
        //   this.moviesPoster = this.moviesStored.moviePosterPaths;
        //   this.moviesId = this.moviesStored.movieIds;
        //   this.moviesNames = this.moviesStored.movieNames;
        //   this.moviesRating = this.moviesStored.movieRatings;
        // }
      },
    });
  }

  ngAfterViewChecked(): void {}
  trackByFn(index, item) {
    return item.id;
  }

  getMovies() {
    this.recentMovies = this.moviesService.getData();

    switch (this.movieType) {
      case 'recents':
        if (this.recentMovies != null) {
          this.movies = this.recentMovies.movies;
          this.moviesRating = this.recentMovies.movieRatings;
          this.moviesPoster = this.recentMovies.moviePosterPaths;
          this.moviesId = this.recentMovies.movieIds;
          this.moviesNames = this.recentMovies.movieNames;
          this.moviesService.isFetching.next(this.isFetching);
          this.movies.forEach((movie) => {
            if (this.watchList?.some((item) => item.id == movie.id)) {
              movie['liked'] = true;
            }
          });
        }
        break;

      case 'trending':
        this.httpService
          .getTrending()
          .pipe(distinctUntilChanged())
          .subscribe({
            next: (movieData) => {
              this.movies = movieData.movies;
              this.moviesRating = movieData.movieRatings;
              this.moviesPoster = movieData.moviePosterPaths;
              this.moviesId = movieData.movieIds;
              this.moviesNames = movieData.movieNames;

              this.isFetching = false;
              this.moviesService.isFetching.next(this.isFetching);

              this.movies.forEach((movie) => {
                if (this.watchList?.some((item) => item.id == movie.id)) {
                  movie['liked'] = true;
                }
              });

              localStorage.setItem('trending', JSON.stringify(movieData));

              this.moviesStored = JSON.parse(localStorage.getItem('trending'));
            },
            error: (err) => {
              if (err) {
                this.error = true;
                this.moviesService.errorOcurred.next(this.error);
                this.isFetching = false;
                this.moviesService.isFetching.next(this.isFetching);
              }
            },
          });
        break;

      case 'popular':
        this.httpService.getPopular().subscribe({
          next: (movieData) => {
            this.movies = movieData.movies;
            this.moviesRating = movieData.movieRatings;
            this.moviesPoster = movieData.moviePosterPaths;
            this.moviesId = movieData.movieIds;
            this.moviesNames = movieData.movieNames;

            this.isFetching = false;
            this.moviesService.isFetching.next(this.isFetching);

            this.movies.forEach((movie) => {
              if (this.watchList?.some((item) => item.id == movie.id)) {
                movie['liked'] = true;
              }
            });

            localStorage.setItem('popular', JSON.stringify(movieData));

            this.moviesStored = JSON.parse(localStorage.getItem('popular'));
          },
          error: (err) => {
            if (err) {
              this.error = true;
              this.moviesService.errorOcurred.next(this.error);
              this.isFetching = false;
              this.moviesService.isFetching.next(this.isFetching);
            }
          },
        });
        break;

      case 'popular_2':
        this.httpService.getPopular_2().subscribe({
          next: (movieData) => {
            this.movies = movieData.movies;
            this.moviesRating = movieData.movieRatings;
            this.moviesPoster = movieData.moviePosterPaths;
            this.moviesId = movieData.movieIds;
            this.moviesNames = movieData.movieNames;

            this.isFetching = false;
            this.moviesService.isFetching.next(this.isFetching);

            this.movies.forEach((movie) => {
              if (this.watchList?.some((item) => item.id == movie.id)) {
                movie['liked'] = true;
              }
            });

            localStorage.setItem('popular_2', JSON.stringify(movieData));

            this.moviesStored = JSON.parse(localStorage.getItem('popular_2'));
          },
          error: (err) => {
            if (err) {
              this.error = true;
              this.moviesService.errorOcurred.next(this.error);
              this.isFetching = false;
              this.moviesService.isFetching.next(this.isFetching);
            }
          },
        });
        break;

      case 'top-rated':
        this.httpService.getTopRated().subscribe({
          next: (movieData) => {
            this.movies = movieData.movies;
            this.moviesRating = movieData.movieRatings;
            this.moviesPoster = movieData.moviePosterPaths;
            this.moviesId = movieData.movieIds;
            this.moviesNames = movieData.movieNames;

            this.isFetching = false;
            this.moviesService.isFetching.next(this.isFetching);

            this.movies.forEach((movie) => {
              if (this.watchList?.some((item) => item.id == movie.id)) {
                movie['liked'] = true;
              }
            });

            localStorage.setItem('top-rated', JSON.stringify(movieData));

            this.moviesStored = JSON.parse(localStorage.getItem('top-rated'));
          },
          error: (err) => {
            if (err) {
              this.error = true;
              this.moviesService.errorOcurred.next(this.error);
              this.isFetching = false;
              this.moviesService.isFetching.next(this.isFetching);
            }
          },
        });
        break;

      case 'top-rated_2':
        this.httpService.getTopRated_2().subscribe({
          next: (movieData) => {
            this.movies = movieData.movies;
            this.moviesRating = movieData.movieRatings;
            this.moviesPoster = movieData.moviePosterPaths;
            this.moviesId = movieData.movieIds;
            this.moviesNames = movieData.movieNames;

            this.isFetching = false;
            this.moviesService.isFetching.next(this.isFetching);

            this.movies.forEach((movie) => {
              if (this.watchList?.some((item) => item.id == movie.id)) {
                movie['liked'] = true;
              }
            });

            localStorage.setItem('top-rated_2', JSON.stringify(movieData));

            this.moviesStored = JSON.parse(localStorage.getItem('top-rated_2'));
          },
          error: (err) => {
            if (err) {
              this.error = true;
              this.moviesService.errorOcurred.next(this.error);
              this.isFetching = false;
              this.moviesService.isFetching.next(this.isFetching);
            }
          },
        });
        break;

      case 'searchedMovies':
        if (localStorage.getItem('searchedMovies')) {
          const movies = JSON.parse(localStorage.getItem('searchedMovies'));

          this.movies = movies.movies;
          this.moviesPoster = movies.moviePosterPaths;
          this.moviesRating = movies.movieRatings;
          this.moviesId = movies.movieIds;
          this.moviesNames = movies.movieNames;

          this.isFetching = false;
          this.moviesService.isFetching.next(this.isFetching);

          this.movies.forEach((movie) => {
            if (this.watchList?.some((item) => item.id == movie.id)) {
              movie['liked'] = true;
            }
          });
        }

        if (localStorage.getItem('searchName')) {
          const name = JSON.parse(localStorage.getItem('searchName'));
          this.moviesService.searchName.next(name);
        }

        this.moviesService.moviesSearch.subscribe({
          next: (movies) => {
            localStorage.setItem('searchedMovies', JSON.stringify(movies));

            this.movies = movies.movies;
            this.moviesPoster = movies.moviePosterPaths;
            this.moviesRating = movies.movieRatings;
            this.moviesId = movies.movieIds;
            this.moviesNames = movies.movieNames;

            this.isFetching = false;
            this.moviesService.isFetching.next(this.isFetching);

            this.moviesService.searchName.subscribe((name) => {
              localStorage.setItem('searchName', JSON.stringify(name));
            });

            // localStorage.setItem('Movies', JSON.stringify(movies));

            if (JSON.parse(localStorage.getItem('searchedMovies')) != null) {
              this.moviesStored = JSON.parse(
                localStorage.getItem('searchedMovies')
              );
            } else {
              this.moviesStored = {
                movieIds: [],
                movieNames: [],
                moviePosterPaths: [],
                movieRatings: [],
                movies: [],
              };
            }
          },
        });

        this.searchState = this.moviesService.searchState;
        break;
    }
  }

  addOrRemoveLiked(e, id, movie) {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user != null) {
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
    } else {
      localStorage.setItem(
        'pendingWatchlist',
        JSON.stringify({ element: e, movieId: id, movie: movie })
      );
      this.router.navigate(['/', 'sign-in']);
    }
  }

  closeRecents() {
    this.moviesService.searching.next(false);
  }
}
