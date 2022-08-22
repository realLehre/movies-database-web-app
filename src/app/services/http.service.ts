import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class HttpService {
  api_key = env.API_Key;

  constructor(private http: HttpClient) {}

  getMovies() {
    return this.http.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${this.api_key}&language=en-US&sort_by=popularity.desc&include_adult=false&page=2`,
      {
        headers: new HttpHeaders({ Accept: 'application/json' }),
      }
    );
  }

  getMovieVideo() {
    return this.http.get(
      `https://api.themoviedb.org/3/movie/297762/videos?api_key=${this.api_key}&append_to_response=videos`
    );
  }

  getMovieDetails() {
    return this.http.get(
      `https://api.themoviedb.org/3/movie/297762?api_key=${this.api_key}&append_to_response=credits`
    );
  }
}
