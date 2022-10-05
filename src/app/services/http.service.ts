import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Subject, throwError } from 'rxjs';

import { environment as env } from 'src/environments/environment.prod';
import { MovieObject, RefinedResponse, Response } from '../shared/movie.model';
import { MoviesService } from './movies.service';

@Injectable({ providedIn: 'root' })
export class HttpService {
  api_key = env.API_Key;
  isLoading = new Subject<boolean>();

  constructor(private http: HttpClient, private moviesService: MoviesService) {}

  getTrending() {
    return this.http
      .get<Response>(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${env.API_Key}`
      )
      .pipe(
        map((data) => {
          return this.transformMovieResponse(data.results);
        }),
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  getPopular() {
    return this.http
      .get<Response>(
        `https://api.themoviedb.org/3/movie/popular?api_key=${env.API_Key}&language=en-US&page=1`
      )
      .pipe(
        map((data) => {
          return this.transformMovieResponse(data.results);
        }),
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  getPopular_2() {
    return this.http
      .get<Response>(
        `https://api.themoviedb.org/3/movie/popular?api_key=${env.API_Key}&language=en-US&page=2`
      )
      .pipe(
        map((data) => {
          return this.transformMovieResponse(data.results);
        }),
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  getTopRated() {
    return this.http
      .get<Response>(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${env.API_Key}&language=en-US&page=1`
      )
      .pipe(
        map((data) => {
          return this.transformMovieResponse(data.results);
        }),
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  getTopRated_2() {
    return this.http
      .get<Response>(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${env.API_Key}&language=en-US&page=2`
      )
      .pipe(
        map((data) => {
          return this.transformMovieResponse(data.results);
        }),
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  getSimilar(id) {
    return this.http
      .get<Response>(
        `
      https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${env.API_Key}&language=en-US&page=1`
      )
      .pipe(
        map((data) => {
          return this.transformMovieResponse(data.results);
        }),
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  searchMovies(movie: string) {
    return this.http
      .get<Response>(
        `
      https://api.themoviedb.org/3/search/movie?api_key=${env.API_Key}&language=en-US&page=1&include_adult=false&query=${movie}`
      )
      .pipe(
        map((data) => {
          return this.transformMovieResponse(data.results);
        }),
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  getMovieDetails(id) {
    return this.http
      .get<MovieObject>(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${this.api_key}&append_to_response=credits`
      )
      .pipe(
        map((movieData: MovieObject) => {
          const movie = { ...movieData };

          const rating: number = Math.floor(movieData.vote_average * 10);
          const moviePoster: string = `https://image.tmdb.org/t/p/original${movieData.poster_path}`;

          const movieBackdrop: string = movieData.backdrop_path;
          const movieTitle: string = movieData.title;
          const movieRelease_date: string = movieData.release_date;
          const casts: Array<Object> = movieData.credits.cast;
          const genres: Array<Object> = [];
          for (const key in movieData.genres) {
            genres.push(movieData.genres[key].name);
          }
          const homepage: string = movieData.homepage;
          const id: number = movieData.id;
          const overview: string = movieData.overview;
          const popularity: number = movieData.popularity;
          const liked: boolean = false;

          let runtime: any = movieData.runtime;

          const voteCount: number = movieData.vote_count;

          return {
            vote_average: rating,
            poster_path: moviePoster,
            backdrop_path: movieBackdrop,
            original_title: movieTitle,
            release_date: movieRelease_date,
            casts: casts,
            homepage: homepage,
            id: id,
            overview: overview,
            popularity: popularity,
            runtime: runtime,
            vote_count: voteCount,
            genres: genres,
            liked: liked,
          };
        }),
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  getVideo(id) {
    return this.http
      .get<{ id: number; results: Array<Object> }>(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${env.API_Key}&language=en-US`
      )
      .pipe(
        map((video) => {
          const videoId = video.results;

          const videoKeys: string[] = [];
          videoId.forEach((videoObj) => {
            for (const key in videoObj) {
              if (key == 'key') {
                videoKeys.push(videoObj[key]);
              }
            }
          });

          return videoKeys;
        })
      );
  }

  transformMovieResponse(movies) {
    let refinedData: RefinedResponse;

    const paths = [];
    for (const key in movies) {
      paths.push(
        'https://image.tmdb.org/t/p/original' + movies[key].poster_path
      );
    }

    const ratings = [];
    for (const key in movies) {
      ratings.push(Math.floor(movies[key].vote_average * 10));
    }

    const ids = [];
    for (const key in movies) {
      ids.push(movies[key].id);
    }

    const names = [];
    for (const key in movies) {
      names.push(movies[key].original_title.replace(/\s+/g, ''));
    }

    movies = movies.map((movie) => {
      return { ...movie, liked: false };
    });

    refinedData = {
      movies: movies,
      moviePosterPaths: paths,
      movieRatings: ratings,
      movieIds: ids,
      movieNames: names,
    };

    return refinedData;
  }

  handleError(error) {
    return throwError(() => {
      return new Error(error);
    });
  }
}
