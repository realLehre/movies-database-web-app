import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { MoviesService } from 'src/app/services/movies.service';
import { MovieObject } from 'src/app/shared/movie.model';

@Component({
  selector: 'app-favorite-movies',
  templateUrl: './favorite-movies.component.html',
  styleUrls: ['./favorite-movies.component.scss'],
})
export class FavoriteMoviesComponent implements OnInit {
  likedState: boolean;
  likedName: string;
  likedMovies: Array<MovieObject>;
  likedMoviesRating: Array<number>;
  likedMoviesPoster: string[];
  likedMoviesId: number[];

  constructor(
    private moviesService: MoviesService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.likedMovies = this.moviesService.getLiked().movies;
    this.likedMoviesPoster = this.moviesService.getLiked().moviePosterPaths;
    this.likedMoviesRating = this.moviesService.getLiked().movieRatings;
    this.likedMoviesId = this.moviesService.getLiked().movieIds;

    // this.httpService.getTopRated()
    // .subscribe((movieData) => {
    //   this.likedMovies = movieData.movies;
    //   this.likedMoviesPoster = movieData.moviePosterPaths;
    //   this.likedMoviesRating = movieData.movieRatings;
    //   this.likedMoviesId = movieData.movieIds;
    // });
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
