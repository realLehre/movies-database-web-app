import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpService } from '../services/http.service';

import { MoviesService } from '../services/movies.service';
import { MovieObject, RefinedResponse } from '../shared/movie.model';

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
  trendingMoviesStored: RefinedResponse;

  popularMovies: Array<MovieObject>;
  popularMoviesRating: Array<number>;
  popularMoviesPoster: string[];
  popularMoviesId: number[];
  popularMoviesNames: string[];
  popularMoviesStored: RefinedResponse;

  popularMovies_2: Array<MovieObject>;
  popularMoviesRating_2: Array<number>;
  popularMoviesPoster_2: string[];
  popularMoviesId_2: number[];
  popularMoviesNames_2: string[];
  popularMovies_2Stored: RefinedResponse;

  topRatedMovies: Array<MovieObject>;
  topRatedMoviesRating: Array<number>;
  topRatedMoviesPoster: string[];
  topRatedMoviesId: number[];
  topRatedMoviesNames: string[];
  topRatedMoviesStored: RefinedResponse;

  topRatedMovies_2: Array<MovieObject>;
  topRatedMovies_2Rating: Array<number>;
  topRatedMovies_2Poster: string[];
  topRatedMovies_2Id: number[];
  topRatedMovies_2Names: string[];
  topRatedMovies_2Stored: RefinedResponse;

  searchState: boolean;
  searchName: string;
  searchMovies: Array<MovieObject>;
  searchMoviesRating: Array<number>;
  searchMoviesPoster: string[];
  searchMoviesId: number[];
  searchMoviesNames: string[];
  searchMoviesStored: RefinedResponse;

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
        this.trendingMoviesPoster = movieData.moviePosterPaths;
        this.trendingMoviesRating = movieData.movieRatings;
        this.trendingMoviesId = movieData.movieIds;
        this.trendingMoviesNames = movieData.movieNames;

        this.trendingMovies.forEach((movie) => {
          if (likedMoviesTest.some((item) => item.id == movie.id)) {
            movie['liked'] = true;
          }
        });

        localStorage.setItem('trending', JSON.stringify(movieData));

        this.trendingMoviesStored = JSON.parse(
          localStorage.getItem('trending')
        );

        console.log(this.trendingMoviesStored);
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
        this.popularMoviesPoster = movieData.moviePosterPaths;
        this.popularMoviesRating = movieData.movieRatings;
        this.popularMoviesId = movieData.movieIds;
        this.popularMoviesNames = movieData.movieNames;

        this.popularMovies.forEach((movie) => {
          if (likedMoviesTest.some((item) => item.id == movie.id)) {
            movie['liked'] = true;
          }
        });

        localStorage.setItem('popular', JSON.stringify(movieData));

        this.popularMoviesStored = JSON.parse(localStorage.getItem('popular'));
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
        this.popularMoviesPoster_2 = movieData.moviePosterPaths;
        this.popularMoviesRating_2 = movieData.movieRatings;
        this.popularMoviesId_2 = movieData.movieIds;
        this.popularMoviesNames_2 = movieData.movieNames;

        this.popularMovies_2.forEach((movie) => {
          if (likedMoviesTest.some((item) => item.id == movie.id)) {
            movie['liked'] = true;
          }
        });

        localStorage.setItem('popular_2', JSON.stringify(movieData));

        this.popularMovies_2Stored = JSON.parse(
          localStorage.getItem('popular_2')
        );
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
        this.topRatedMovies = movieData.movies;
        this.topRatedMoviesPoster = movieData.moviePosterPaths;
        this.topRatedMoviesRating = movieData.movieRatings;
        this.topRatedMoviesId = movieData.movieIds;
        this.topRatedMoviesNames = movieData.movieNames;

        this.topRatedMovies.forEach((movie) => {
          if (likedMoviesTest.some((item) => item.id == movie.id)) {
            movie['liked'] = true;
          }
        });

        localStorage.setItem('topRated', JSON.stringify(movieData));

        this.topRatedMoviesStored = JSON.parse(
          localStorage.getItem('topRated')
        );
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

        localStorage.setItem('topRated_2', JSON.stringify(movieData));

        this.topRatedMovies_2Stored = JSON.parse(
          localStorage.getItem('topRated_2')
        );
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

        localStorage.setItem('Movies', JSON.stringify(movies));
        if (JSON.parse(localStorage.getItem('Movies')) != null) {
          this.searchMoviesStored = JSON.parse(localStorage.getItem('Movies'));
        } else {
          this.searchMoviesStored = {
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

    this.moviesService.sortValue.subscribe({
      next: (value) => {
        this.sortValue = value;
      },
    });

    this.moviesService.sortValue.subscribe({
      next: (value) => {
        this.sortValue = value;

        // const trendingMoviesStored: RefinedResponse = JSON.parse(
        //   localStorage.getItem('trending')
        // );

        const popularMoviesStored: RefinedResponse = JSON.parse(
          localStorage.getItem('popular')
        );

        const popularMovies_2Stored: RefinedResponse = JSON.parse(
          localStorage.getItem('popular_2')
        );

        const topRatedMoviesStored: RefinedResponse = JSON.parse(
          localStorage.getItem('topRated')
        );

        const topRatedMovies_2Stored: RefinedResponse = JSON.parse(
          localStorage.getItem('topRated_2')
        );

        const searchMoviesStored: RefinedResponse = JSON.parse(
          localStorage.getItem('Movies')
        );

        const filteredTrending = [];
        const trendingPosters = [];
        const trendingIds = [];
        const trendingRatings = [];
        const trendingNames = [];

        const filteredPopular = [];
        const popularPosters = [];
        const popularIds = [];
        const popularRatings = [];
        const popularNames = [];

        const filteredPopular_2 = [];
        const popularPosters_2 = [];
        const popularIds_2 = [];
        const popularRatings_2 = [];
        const popularNames_2 = [];

        const filteredTopRated = [];
        const topRatedPosters = [];
        const topRatedIds = [];
        const topRatedRatings = [];
        const topRatedNames = [];

        const filteredTopRated_2 = [];
        const topRatedPosters_2 = [];
        const topRatedIds_2 = [];
        const topRatedRatings_2 = [];
        const topRatedNames_2 = [];

        const filteredSearch = [];
        const searchPosters = [];
        const searchIds = [];
        const searchRatings = [];
        const searchNames = [];

        if (value == 'action') {
          if (JSON.parse(localStorage.getItem('Movies')) != null) {
            this.searchMoviesStored.movies.filter((movie) => {
              for (const key in movie.genre_ids) {
                if (movie.genre_ids[key] == 28) {
                  filteredSearch.push(movie);

                  searchPosters.push(
                    'https://image.tmdb.org/t/p/original' + movie.poster_path
                  );

                  searchIds.push(movie.id);

                  searchRatings.push(Math.floor(movie.vote_average * 10));

                  searchNames.push(movie.original_title.replace(/\s+/g, ''));
                }
              }
            });
            this.searchMovies = filteredSearch;
            this.searchMoviesPoster = searchPosters;
            this.searchMoviesId = searchIds;
            this.searchMoviesNames = searchNames;
            this.searchMoviesRating = searchRatings;
          }

          this.trendingMoviesStored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 28) {
                filteredTrending.push(movie);

                trendingPosters.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                trendingIds.push(movie.id);

                trendingRatings.push(Math.floor(movie.vote_average * 10));

                trendingNames.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.trendingMovies = filteredTrending;
          this.trendingMoviesPoster = trendingPosters;
          this.trendingMoviesId = trendingIds;
          this.trendingMoviesNames = trendingNames;
          this.trendingMoviesRating = trendingRatings;

          this.popularMoviesStored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 28) {
                filteredPopular.push(movie);

                popularPosters.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                popularIds.push(movie.id);

                popularRatings.push(Math.floor(movie.vote_average * 10));

                popularNames.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.popularMovies = filteredPopular;
          this.popularMoviesPoster = popularPosters;
          this.popularMoviesId = popularIds;
          this.popularMoviesNames = popularNames;
          this.popularMoviesRating = popularRatings;

          this.popularMovies_2Stored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 28) {
                filteredPopular_2.push(movie);

                popularPosters_2.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );
                popularIds_2.push(movie.id);

                popularRatings_2.push(Math.floor(movie.vote_average * 10));

                popularNames_2.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.popularMovies_2 = filteredPopular_2;
          this.popularMoviesPoster_2 = popularPosters_2;
          this.popularMoviesId_2 = popularIds_2;
          this.popularMoviesNames_2 = popularNames_2;
          this.popularMoviesRating_2 = popularRatings_2;

          this.topRatedMoviesStored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 28) {
                filteredTopRated.push(movie);

                topRatedPosters.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                topRatedIds.push(movie.id);

                topRatedRatings.push(Math.floor(movie.vote_average * 10));

                topRatedNames.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.topRatedMovies = filteredTopRated;
          this.topRatedMoviesPoster = topRatedPosters;
          this.topRatedMoviesId = topRatedIds;
          this.topRatedMoviesNames = topRatedNames;
          this.topRatedMoviesRating = topRatedRatings;

          this.topRatedMovies_2Stored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 28) {
                filteredTopRated_2.push(movie);

                topRatedPosters_2.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                topRatedIds_2.push(movie.id);

                topRatedRatings_2.push(Math.floor(movie.vote_average * 10));

                topRatedNames_2.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.topRatedMovies_2 = filteredTopRated_2;
          this.topRatedMovies_2Poster = topRatedPosters_2;
          this.topRatedMovies_2Id = topRatedIds_2;
          this.topRatedMovies_2Names = topRatedNames_2;
          this.topRatedMovies_2Rating = topRatedRatings_2;
        }

        if (value == 'drama') {
          if (JSON.parse(localStorage.getItem('Movies')) != null) {
            this.searchMoviesStored.movies.filter((movie) => {
              for (const key in movie.genre_ids) {
                if (movie.genre_ids[key] == 18) {
                  filteredSearch.push(movie);

                  searchPosters.push(
                    'https://image.tmdb.org/t/p/original' + movie.poster_path
                  );

                  searchIds.push(movie.id);

                  searchRatings.push(Math.floor(movie.vote_average * 10));

                  searchNames.push(movie.original_title.replace(/\s+/g, ''));
                }
              }
            });
            this.searchMovies = filteredSearch;
            this.searchMoviesPoster = searchPosters;
            this.searchMoviesId = searchIds;
            this.searchMoviesNames = searchNames;
            this.searchMoviesRating = searchRatings;
          }

          this.trendingMoviesStored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 18) {
                filteredTrending.push(movie);

                trendingPosters.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                trendingIds.push(movie.id);

                trendingRatings.push(Math.floor(movie.vote_average * 10));

                trendingNames.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.trendingMovies = filteredTrending;
          this.trendingMoviesPoster = trendingPosters;
          this.trendingMoviesId = trendingIds;
          this.trendingMoviesNames = trendingNames;
          this.trendingMoviesRating = trendingRatings;

          this.popularMoviesStored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 18) {
                filteredPopular.push(movie);

                popularPosters.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                popularIds.push(movie.id);

                popularRatings.push(Math.floor(movie.vote_average * 10));

                popularNames.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.popularMovies = filteredPopular;
          this.popularMoviesPoster = popularPosters;
          this.popularMoviesId = popularIds;
          this.popularMoviesNames = popularNames;
          this.popularMoviesRating = popularRatings;

          this.popularMovies_2Stored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 18) {
                filteredPopular_2.push(movie);

                popularPosters_2.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );
                popularIds_2.push(movie.id);

                popularRatings_2.push(Math.floor(movie.vote_average * 10));

                popularNames_2.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.popularMovies_2 = filteredPopular_2;
          this.popularMoviesPoster_2 = popularPosters_2;
          this.popularMoviesId_2 = popularIds_2;
          this.popularMoviesNames_2 = popularNames_2;
          this.popularMoviesRating_2 = popularRatings_2;

          this.topRatedMoviesStored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 18) {
                filteredTopRated.push(movie);

                topRatedPosters.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                topRatedIds.push(movie.id);

                topRatedRatings.push(Math.floor(movie.vote_average * 10));

                topRatedNames.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.topRatedMovies = filteredTopRated;
          this.topRatedMoviesPoster = topRatedPosters;
          this.topRatedMoviesId = topRatedIds;
          this.topRatedMoviesNames = topRatedNames;
          this.topRatedMoviesRating = topRatedRatings;

          this.topRatedMovies_2Stored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 18) {
                filteredTopRated_2.push(movie);

                topRatedPosters_2.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                topRatedIds_2.push(movie.id);

                topRatedRatings_2.push(Math.floor(movie.vote_average * 10));

                topRatedNames_2.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.topRatedMovies_2 = filteredTopRated_2;
          this.topRatedMovies_2Poster = topRatedPosters_2;
          this.topRatedMovies_2Id = topRatedIds_2;
          this.topRatedMovies_2Names = topRatedNames_2;
          this.topRatedMovies_2Rating = topRatedRatings_2;
        }

        if (value == 'crime') {
          if (JSON.parse(localStorage.getItem('Movies')) != null) {
            this.searchMoviesStored.movies.filter((movie) => {
              for (const key in movie.genre_ids) {
                if (movie.genre_ids[key] == 80) {
                  filteredSearch.push(movie);

                  searchPosters.push(
                    'https://image.tmdb.org/t/p/original' + movie.poster_path
                  );

                  searchIds.push(movie.id);

                  searchRatings.push(Math.floor(movie.vote_average * 10));

                  searchNames.push(movie.original_title.replace(/\s+/g, ''));
                }
              }
            });
            this.searchMovies = filteredSearch;
            this.searchMoviesPoster = searchPosters;
            this.searchMoviesId = searchIds;
            this.searchMoviesNames = searchNames;
            this.searchMoviesRating = searchRatings;
          }

          this.trendingMoviesStored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 80) {
                filteredTrending.push(movie);

                trendingPosters.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                trendingIds.push(movie.id);

                trendingRatings.push(Math.floor(movie.vote_average * 10));

                trendingNames.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.trendingMovies = filteredTrending;
          this.trendingMoviesPoster = trendingPosters;
          this.trendingMoviesId = trendingIds;
          this.trendingMoviesNames = trendingNames;
          this.trendingMoviesRating = trendingRatings;

          popularMoviesStored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 80) {
                filteredPopular.push(movie);

                popularPosters.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                popularIds.push(movie.id);

                popularRatings.push(Math.floor(movie.vote_average * 10));

                popularNames.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.popularMovies = filteredPopular;
          this.popularMoviesPoster = popularPosters;
          this.popularMoviesId = popularIds;
          this.popularMoviesNames = popularNames;
          this.popularMoviesRating = popularRatings;

          popularMovies_2Stored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 80) {
                filteredPopular_2.push(movie);

                popularPosters_2.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );
                popularIds_2.push(movie.id);

                popularRatings_2.push(Math.floor(movie.vote_average * 10));

                popularNames_2.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.popularMovies_2 = filteredPopular_2;
          this.popularMoviesPoster_2 = popularPosters_2;
          this.popularMoviesId_2 = popularIds_2;
          this.popularMoviesNames_2 = popularNames_2;
          this.popularMoviesRating_2 = popularRatings_2;

          topRatedMoviesStored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 80) {
                filteredTopRated.push(movie);

                topRatedPosters.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                topRatedIds.push(movie.id);

                topRatedRatings.push(Math.floor(movie.vote_average * 10));

                topRatedNames.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.topRatedMovies = filteredTopRated;
          this.topRatedMoviesPoster = topRatedPosters;
          this.topRatedMoviesId = topRatedIds;
          this.topRatedMoviesNames = topRatedNames;
          this.topRatedMoviesRating = topRatedRatings;

          topRatedMovies_2Stored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 80) {
                filteredTopRated_2.push(movie);

                topRatedPosters_2.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                topRatedIds_2.push(movie.id);

                topRatedRatings_2.push(Math.floor(movie.vote_average * 10));

                topRatedNames_2.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.topRatedMovies_2 = filteredTopRated_2;
          this.topRatedMovies_2Poster = topRatedPosters_2;
          this.topRatedMovies_2Id = topRatedIds_2;
          this.topRatedMovies_2Names = topRatedNames_2;
          this.topRatedMovies_2Rating = topRatedRatings_2;
        }

        if (value == 'adventure') {
          if (JSON.parse(localStorage.getItem('Movies')) != null) {
            this.searchMoviesStored.movies.filter((movie) => {
              for (const key in movie.genre_ids) {
                if (movie.genre_ids[key] == 12) {
                  filteredSearch.push(movie);

                  searchPosters.push(
                    'https://image.tmdb.org/t/p/original' + movie.poster_path
                  );

                  searchIds.push(movie.id);

                  searchRatings.push(Math.floor(movie.vote_average * 10));

                  searchNames.push(movie.original_title.replace(/\s+/g, ''));
                }
              }
            });
            this.searchMovies = filteredSearch;
            this.searchMoviesPoster = searchPosters;
            this.searchMoviesId = searchIds;
            this.searchMoviesNames = searchNames;
            this.searchMoviesRating = searchRatings;
          }

          this.trendingMoviesStored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 12) {
                filteredTrending.push(movie);

                trendingPosters.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                trendingIds.push(movie.id);

                trendingRatings.push(Math.floor(movie.vote_average * 10));

                trendingNames.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.trendingMovies = filteredTrending;
          this.trendingMoviesPoster = trendingPosters;
          this.trendingMoviesId = trendingIds;
          this.trendingMoviesNames = trendingNames;
          this.trendingMoviesRating = trendingRatings;

          popularMoviesStored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 12) {
                filteredPopular.push(movie);

                popularPosters.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                popularIds.push(movie.id);

                popularRatings.push(Math.floor(movie.vote_average * 10));

                popularNames.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.popularMovies = filteredPopular;
          this.popularMoviesPoster = popularPosters;
          this.popularMoviesId = popularIds;
          this.popularMoviesNames = popularNames;
          this.popularMoviesRating = popularRatings;

          popularMovies_2Stored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 12) {
                filteredPopular_2.push(movie);

                popularPosters_2.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );
                popularIds_2.push(movie.id);

                popularRatings_2.push(Math.floor(movie.vote_average * 10));

                popularNames_2.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.popularMovies_2 = filteredPopular_2;
          this.popularMoviesPoster_2 = popularPosters_2;
          this.popularMoviesId_2 = popularIds_2;
          this.popularMoviesNames_2 = popularNames_2;
          this.popularMoviesRating_2 = popularRatings_2;

          topRatedMoviesStored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 12) {
                filteredTopRated.push(movie);

                topRatedPosters.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                topRatedIds.push(movie.id);

                topRatedRatings.push(Math.floor(movie.vote_average * 10));

                topRatedNames.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.topRatedMovies = filteredTopRated;
          this.topRatedMoviesPoster = topRatedPosters;
          this.topRatedMoviesId = topRatedIds;
          this.topRatedMoviesNames = topRatedNames;
          this.topRatedMoviesRating = topRatedRatings;

          topRatedMovies_2Stored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 12) {
                filteredTopRated_2.push(movie);

                topRatedPosters_2.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                topRatedIds_2.push(movie.id);

                topRatedRatings_2.push(Math.floor(movie.vote_average * 10));

                topRatedNames_2.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.topRatedMovies_2 = filteredTopRated_2;
          this.topRatedMovies_2Poster = topRatedPosters_2;
          this.topRatedMovies_2Id = topRatedIds_2;
          this.topRatedMovies_2Names = topRatedNames_2;
          this.topRatedMovies_2Rating = topRatedRatings_2;
        }

        if (value == 'horror') {
          if (JSON.parse(localStorage.getItem('Movies')) != null) {
            this.searchMoviesStored.movies.filter((movie) => {
              for (const key in movie.genre_ids) {
                if (movie.genre_ids[key] == 27) {
                  filteredSearch.push(movie);

                  searchPosters.push(
                    'https://image.tmdb.org/t/p/original' + movie.poster_path
                  );

                  searchIds.push(movie.id);

                  searchRatings.push(Math.floor(movie.vote_average * 10));

                  searchNames.push(movie.original_title.replace(/\s+/g, ''));
                }
              }
            });
            this.searchMovies = filteredSearch;
            this.searchMoviesPoster = searchPosters;
            this.searchMoviesId = searchIds;
            this.searchMoviesNames = searchNames;
            this.searchMoviesRating = searchRatings;
          }

          this.trendingMoviesStored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 27) {
                filteredTrending.push(movie);

                trendingPosters.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                trendingIds.push(movie.id);

                trendingRatings.push(Math.floor(movie.vote_average * 10));

                trendingNames.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.trendingMovies = filteredTrending;
          this.trendingMoviesPoster = trendingPosters;
          this.trendingMoviesId = trendingIds;
          this.trendingMoviesNames = trendingNames;
          this.trendingMoviesRating = trendingRatings;

          popularMoviesStored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 27) {
                filteredPopular.push(movie);

                popularPosters.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                popularIds.push(movie.id);

                popularRatings.push(Math.floor(movie.vote_average * 10));

                popularNames.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.popularMovies = filteredPopular;
          this.popularMoviesPoster = popularPosters;
          this.popularMoviesId = popularIds;
          this.popularMoviesNames = popularNames;
          this.popularMoviesRating = popularRatings;

          popularMovies_2Stored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 27) {
                filteredPopular_2.push(movie);

                popularPosters_2.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );
                popularIds_2.push(movie.id);

                popularRatings_2.push(Math.floor(movie.vote_average * 10));

                popularNames_2.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.popularMovies_2 = filteredPopular_2;
          this.popularMoviesPoster_2 = popularPosters_2;
          this.popularMoviesId_2 = popularIds_2;
          this.popularMoviesNames_2 = popularNames_2;
          this.popularMoviesRating_2 = popularRatings_2;

          topRatedMoviesStored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 27) {
                filteredTopRated.push(movie);

                topRatedPosters.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                topRatedIds.push(movie.id);

                topRatedRatings.push(Math.floor(movie.vote_average * 10));

                topRatedNames.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.topRatedMovies = filteredTopRated;
          this.topRatedMoviesPoster = topRatedPosters;
          this.topRatedMoviesId = topRatedIds;
          this.topRatedMoviesNames = topRatedNames;
          this.topRatedMoviesRating = topRatedRatings;

          topRatedMovies_2Stored.movies.filter((movie) => {
            for (const key in movie.genre_ids) {
              if (movie.genre_ids[key] == 27) {
                filteredTopRated_2.push(movie);

                topRatedPosters_2.push(
                  'https://image.tmdb.org/t/p/original' + movie.poster_path
                );

                topRatedIds_2.push(movie.id);

                topRatedRatings_2.push(Math.floor(movie.vote_average * 10));

                topRatedNames_2.push(movie.original_title.replace(/\s+/g, ''));
              }
            }
          });
          this.topRatedMovies_2 = filteredTopRated_2;
          this.topRatedMovies_2Poster = topRatedPosters_2;
          this.topRatedMovies_2Id = topRatedIds_2;
          this.topRatedMovies_2Names = topRatedNames_2;
          this.topRatedMovies_2Rating = topRatedRatings_2;
        }

        if (
          value != 'action' &&
          value != 'drama' &&
          value != 'crime' &&
          value != 'adventure' &&
          value != 'horror'
        ) {
          this.searchMovies = this.searchMoviesStored.movies;
          this.searchMoviesPoster = this.searchMoviesStored.moviePosterPaths;
          this.searchMoviesId = this.searchMoviesStored.movieIds;
          this.searchMoviesNames = this.searchMoviesStored.movieNames;
          this.searchMoviesRating = this.searchMoviesStored.movieRatings;

          this.trendingMovies = this.trendingMoviesStored.movies;
          this.trendingMoviesPoster =
            this.trendingMoviesStored.moviePosterPaths;
          this.trendingMoviesId = this.trendingMoviesStored.movieIds;
          this.trendingMoviesNames = this.trendingMoviesStored.movieNames;
          this.trendingMoviesRating = this.trendingMoviesStored.movieRatings;

          this.popularMovies = this.popularMoviesStored.movies;
          this.popularMoviesPoster = this.popularMoviesStored.moviePosterPaths;
          this.popularMoviesId = this.popularMoviesStored.movieIds;
          this.popularMoviesNames = this.popularMoviesStored.movieNames;
          this.popularMoviesRating = this.popularMoviesStored.movieRatings;

          this.popularMovies_2 = this.popularMovies_2Stored.movies;
          this.popularMoviesPoster_2 =
            this.popularMovies_2Stored.moviePosterPaths;
          this.popularMoviesId_2 = this.popularMovies_2Stored.movieIds;
          this.popularMoviesNames_2 = this.popularMovies_2Stored.movieNames;
          this.popularMoviesRating_2 = this.popularMovies_2Stored.movieRatings;

          this.topRatedMovies = this.topRatedMoviesStored.movies;
          this.topRatedMoviesPoster =
            this.topRatedMoviesStored.moviePosterPaths;
          this.topRatedMoviesId = this.topRatedMoviesStored.movieIds;
          this.topRatedMoviesNames = this.topRatedMoviesStored.movieNames;
          this.topRatedMoviesRating = this.topRatedMoviesStored.movieRatings;

          this.topRatedMovies_2 = this.topRatedMovies_2Stored.movies;
          this.topRatedMovies_2Poster =
            this.topRatedMovies_2Stored.moviePosterPaths;
          this.topRatedMovies_2Id = this.topRatedMovies_2Stored.movieIds;
          this.topRatedMovies_2Names = this.topRatedMovies_2Stored.movieNames;
          this.topRatedMovies_2Rating =
            this.topRatedMovies_2Stored.movieRatings;
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

  closeRecents() {
    this.moviesService.searching.next(false);
  }

  ratingColor(rating: number): string {
    return this.moviesService.ratingColor(rating);
  }
}
