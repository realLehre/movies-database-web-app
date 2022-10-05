import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { MoviesService } from 'src/app/services/movies.service';
import { MovieObject, RefinedResponse } from 'src/app/shared/movie.model';

@Component({
  selector: 'app-movie-type',
  templateUrl: './movie-type.component.html',
  styleUrls: ['./movie-type.component.scss'],
})
export class MovieTypeComponent implements OnInit {
  @Input() movieType: string;

  movies: Array<MovieObject>;
  moviesRating: Array<number>;
  moviesPoster: string[];
  moviesId: number[];
  moviesNames: string[];
  moviesStored: RefinedResponse;

  error: boolean;
  isFetching: boolean;
  sortValue: string;

  movieRatingColor: string;

  constructor(
    private moviesService: MoviesService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    const likedMoviesTest = this.moviesService.getLikedMovies();

    switch (this.movieType) {
      case 'trending':
        this.httpService.getTrending().subscribe({
          next: (movieData) => {
            this.movies = movieData.movies;
            this.moviesRating = movieData.movieRatings;
            this.moviesPoster = movieData.moviePosterPaths;
            this.moviesId = movieData.movieIds;
            this.moviesNames = movieData.movieNames;

            this.movies.forEach((movie) => {
              if (likedMoviesTest.some((item) => item.id == movie.id)) {
                movie['liked'] = true;
              }
            });

            localStorage.setItem('trending', JSON.stringify(movieData));

            this.moviesStored = JSON.parse(localStorage.getItem('trending'));
          },
          error: (err) => {
            if (err) {
              this.error = true;
              this.isFetching = false;
              this.moviesService.isFetching.next(this.isFetching);
            }
          },
        });
    }

    this.moviesService.sortValue.subscribe({
      next: (value) => {
        this.sortValue = value;

        const filteredMovies = [];
        const moviesPosters = [];
        const moviesIds = [];
        const moviesRatings = [];
        const moviesNames = [];

        switch (value) {
          case 'action':
            this.moviesStored.movies.filter((movie) => {
              for (const key in movie.genre_ids) {
                if (movie.genre_ids[key] == 28) {
                  filteredMovies.push(movie);

                  moviesPosters.push(
                    'https://image.tmdb.org/t/p/original' + movie.poster_path
                  );

                  moviesIds.push(movie.id);

                  moviesRatings.push(Math.floor(movie.vote_average * 10));

                  moviesNames.push(movie.original_title.replace(/\s+/g, ''));
                }
              }
            });
            this.movies = filteredMovies;
            this.moviesPoster = moviesPosters;
            this.moviesId = moviesIds;
            this.moviesNames = moviesNames;
            this.moviesRating = moviesRatings;
        }

        if (
          value != 'action' &&
          value != 'drama' &&
          value != 'crime' &&
          value != 'adventure' &&
          value != 'horror'
        ) {
          this.movies = this.moviesStored.movies;
          this.moviesPoster = this.moviesStored.moviePosterPaths;
          this.moviesId = this.moviesStored.movieIds;
          this.moviesNames = this.moviesStored.movieNames;
          this.moviesRating = this.moviesStored.movieRatings;
        }
      },
    });
  }

  addToLiked(e, id, movie) {
    movie['liked'] = !movie['liked'];

    const movieContainer = e.target.parentElement.parentElement;

    if (movie['liked'] == true) {
      this.moviesService.onLike(movie, id);

      movieContainer.classList.add('showAdd');

      setTimeout(() => {
        movieContainer.classList.remove('showAdd');
      }, 650);
    } else {
      this.moviesService.onDisLike(id);

      movieContainer.classList.add('showRemove');
      setTimeout(() => {
        movieContainer.classList.remove('showRemove');
      }, 650);
    }
  }

  closeRecents() {
    this.moviesService.searching.next(false);
  }
}
