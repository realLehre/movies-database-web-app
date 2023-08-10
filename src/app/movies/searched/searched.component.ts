import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { MoviesService } from 'src/app/services/movies.service';
import { MovieObject, RefinedResponse } from 'src/app/shared/movie.model';

@Component({
  selector: 'app-searched',
  templateUrl: './searched.component.html',
  styleUrls: ['./searched.component.scss'],
})
export class SearchedComponent implements OnInit, AfterViewChecked {
  @Input('movies') movieInfo;
  @Input() movieType: string;

  movies: Array<MovieObject> = [];
  moviesRating: Array<number>;
  moviesPoster: string[];
  moviesId: number[];
  moviesNames: string[];
  moviesStored: RefinedResponse;
  watchList: MovieObject[] = [];
  searchState: boolean;
  isFetching: boolean;

  constructor(
    private moviesService: MoviesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      this.moviesService.getForComponent().subscribe((userData) => {
        this.watchList = userData.data().watchList;
        this.getMovies();
      });
    } else {
      this.getMovies();
      this.watchList = this.moviesService.getLikedMovies();
    }
    this.authService.clearWatchList.subscribe((status) => {
      this.watchList = [];
      this.getMovies();
    });
  }

  ngAfterViewChecked(): void {
    this.getMovies();
  }

  getMovies() {
    const searchedMovies = JSON.parse(localStorage.getItem('searchedMovies'));
    if (searchedMovies.length != 0) {
      this.movies = searchedMovies.movies;
      this.moviesPoster = searchedMovies.moviePosterPaths;
      this.moviesRating = searchedMovies.movieRatings;
      this.moviesId = searchedMovies.movieIds;
      this.moviesNames = searchedMovies.movieNames;
      this.isFetching = false;
      this.moviesService.isFetching.next(this.isFetching);
      this.movies.forEach((movie) => {
        if (this.watchList.some((item) => item.id == movie.id)) {
          movie['liked'] = true;
        }
      });
    }
    if (localStorage.getItem('searchName')) {
      const name = JSON.parse(localStorage.getItem('searchName'));
      this.moviesService.searchName.next(name);
    }
  }
}
