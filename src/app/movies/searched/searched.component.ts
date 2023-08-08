import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { MoviesService } from 'src/app/services/movies.service';
import { MovieObject, RefinedResponse } from 'src/app/shared/movie.model';

@Component({
  selector: 'app-searched',
  templateUrl: './searched.component.html',
  styleUrls: ['./searched.component.scss'],
})
export class SearchedComponent implements OnInit {
  movies: Array<MovieObject>;
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
    } else {
      this.moviesService.moviesSearch.subscribe((data) => {
        this.movies = data.movies;
        this.moviesPoster = data.moviePosterPaths;
        this.moviesRating = data.movieRatings;
        this.moviesId = data.movieIds;
        this.moviesNames = data.movieNames;
        console.log(this.movies);

        this.isFetching = false;
        this.moviesService.isFetching.next(this.isFetching);

        this.movies.forEach((movie) => {
          if (this.watchList.some((item) => item.id == movie.id)) {
            movie['liked'] = true;
          }
        });
      });

      // this.moviesService.moviesSearch.subscribe({
      //   next: (movies) => {
      //     console.log(movies);

      //     localStorage.setItem('searchedMovies', JSON.stringify(movies));

      //     this.movies = movies.movies;
      //     this.moviesPoster = movies.moviePosterPaths;
      //     this.moviesRating = movies.movieRatings;
      //     this.moviesId = movies.movieIds;
      //     this.moviesNames = movies.movieNames;

      //     this.isFetching = false;
      //     this.moviesService.isFetching.next(this.isFetching);

      //     this.moviesService.searchName.subscribe((name) => {
      //       localStorage.setItem('searchName', JSON.stringify(name));
      //     });

      //     // localStorage.setItem('Movies', JSON.stringify(movies));

      //     if (JSON.parse(localStorage.getItem('searchedMovies')) != null) {
      //       this.moviesStored = JSON.parse(
      //         localStorage.getItem('searchedMovies')
      //       );
      //     } else {
      //       this.moviesStored = {
      //         movieIds: [],
      //         movieNames: [],
      //         moviePosterPaths: [],
      //         movieRatings: [],
      //         movies: [],
      //       };
      //     }
      //   },
      // });
    }

    if (localStorage.getItem('searchName')) {
      const name = JSON.parse(localStorage.getItem('searchName'));
      this.moviesService.searchName.next(name);
    }
  }
}
