import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { environment as env } from 'src/environments/environment.prod';
import { Movie, MovieObject, Response } from '../shared/movie.model';
import { MoviesService } from './movies.service';

@Injectable({ providedIn: 'root' })
export class HttpService {
  api_key = env.API_Key;
  isLoading = new Subject<boolean>();

  constructor(private http: HttpClient, private moviesService: MoviesService) {}

  getTrending() {
    this.isLoading.next(true);

    return this.http.get<Response>(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${env.API_Key}`
    );
  }

  getPopular() {
    // this.isLoading.next(true);

    return this.http.get<Response>(
      `https://api.themoviedb.org/3/movie/popular?api_key=${env.API_Key}&language=en-US&page=12`
    );
  }

  getTopRated() {
    // this.isLoading.next(true);

    return this.http.get<Response>(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${env.API_Key}&language=en-US&page=1`
    );
  }

  getMovieDetails(id) {
    // this.isLoading.next(true);

    return this.http.get<MovieObject>(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${this.api_key}&append_to_response=credits`
    );
  }

  searchMovies(movie: string) {
    // this.isLoading.next(true);

    return this.http.get<Response>(`
      https://api.themoviedb.org/3/search/movie?api_key=${env.API_Key}&language=en-US&page=1&include_adult=false&query=${movie}`);
  }
}
