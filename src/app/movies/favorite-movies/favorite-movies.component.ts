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
  likedName: string;
  likedMovies: Array<MovieObject>;
  likedMoviesRating: Array<number>;
  likedMoviesPoster: string[];
  likedMoviesId: number[];
  likedMoviesName: string[];

  movieRatingColor;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    if (this.moviesService.getLikedMovies().length == 0) {
      this.likedMovies = [];
    } else {
      this.likedMovies = this.moviesService.getLiked().movies;
    }

    this.likedMoviesPoster = this.moviesService.getLiked().moviePosterPaths;
    this.likedMoviesRating = this.moviesService.getLiked().movieRatings;
    this.likedMoviesId = this.moviesService.getLiked().movieIds;
    this.likedMoviesName = this.moviesService.getLiked().movieNames;

    const likedMoviesTest = this.moviesService.getLikedMovies();

    if (this.moviesService.getLikedMovies().length > 0) {
      this.likedMovies.forEach((movie) => {
        if (likedMoviesTest.some((item) => item.id == movie.id)) {
          movie['liked'] = true;
        }
      });
    }
  }

  removeFromLiked(id) {
    this.moviesService.onDisLike(id);

    this.likedMovies = this.moviesService.getLiked().movies;
    this.likedMoviesPoster = this.moviesService.getLiked().moviePosterPaths;
    this.likedMoviesRating = this.moviesService.getLiked().movieRatings;
    this.likedMoviesId = this.moviesService.getLiked().movieIds;
    this.likedMoviesName = this.moviesService.getLiked().movieNames;
  }

  clearLikedMovies() {
    if (confirm('Are you sure?!')) {
      this.likedMovies = [];
      localStorage.setItem('liked', JSON.stringify([]));
    }
  }
}
