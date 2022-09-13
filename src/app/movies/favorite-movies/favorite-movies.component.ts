import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { MoviesService } from 'src/app/services/movies.service';
import { MovieObject } from 'src/app/shared/movie.model';

@Component({
  selector: 'app-favorite-movies',
  templateUrl: './favorite-movies.component.html',
  styleUrls: ['./favorite-movies.component.scss'],
})
export class FavoriteMoviesComponent implements OnInit, AfterViewInit {
  likedState: boolean;
  likedName: string;
  likedMovies: Array<MovieObject>;
  likedMoviesRating: Array<number>;
  likedMoviesPoster: string[];
  likedMoviesId: number[];
  likedMoviesName: string[];

  constructor(
    private moviesService: MoviesService,
    private httpService: HttpService
  ) {}

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

  ngAfterViewInit(): void {}

  removeFromLiked(index, id, movie) {
    movie['liked'] = !movie['liked'];
    this.moviesService.onDisLike(id);
    window.location.reload();
  }

  clearLikedMovies() {
    if (confirm('Are you sure?!')) {
      localStorage.setItem('liked', JSON.stringify([]));
      window.location.reload();
    }
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
