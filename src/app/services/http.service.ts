import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class HttpService {
  api_key = env.API_Key;

  constructor(private http: HttpClient) {}

  getMovies() {
    return this.http.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${this.api_key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=2&with_watch_monetization_types=flatrate`,
      {
        headers: new HttpHeaders({ Accept: 'application/json' }),
      }
    );
  }
}
