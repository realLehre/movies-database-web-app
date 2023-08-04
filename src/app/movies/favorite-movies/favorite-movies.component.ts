import { Component, OnInit } from '@angular/core';
import { MoviesService } from 'src/app/services/movies.service';
import { MovieObject } from 'src/app/shared/movie.model';

@Component({
  selector: 'app-favorite-movies',
  templateUrl: './favorite-movies.component.html',
  styleUrls: ['./favorite-movies.component.scss'],
})
export class FavoriteMoviesComponent implements OnInit {
  likedState: boolean;
  watchListMovieName: string;
  watchList: Array<MovieObject> = [];
  watchListMoviesRating: Array<number>;
  watchListMoviesPoster: string[];
  watchListMoviesId: number[];
  watchListMoviesNames: string[];

  movieRatingColor;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    if (this.moviesService.getLikedMovies().length == 0) {
      this.watchList = [];
    } else {
      this.getMovieInfo();
    }

    const watchList = this.moviesService.getLikedMovies();

    if (watchList.length > 0) {
      this.watchList.forEach((movie) => {
        if (watchList.some((item) => item.id == movie.id)) {
          movie['liked'] = true;
        }
      });
    }
  }

  removeFromLiked(id) {
    this.moviesService.onDisLike(id);

    this.getMovieInfo();
  }

  getMovieInfo() {
    this.watchList = this.moviesService.getWatchList().movies;
    this.watchListMoviesPoster =
      this.moviesService.getWatchList().moviePosterPaths;
    this.watchListMoviesRating = this.moviesService.getWatchList().movieRatings;
    this.watchListMoviesId = this.moviesService.getWatchList().movieIds;
    this.watchListMoviesNames = this.moviesService.getWatchList().movieNames;
  }

  clearLikedMovies() {
    if (confirm('Are you sure?!')) {
      this.watchList = [];

      this.moviesService.clearWatchList();
    }
  }
}
