import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { MoviesService } from 'src/app/services/movies.service';
import { MovieObject } from 'src/app/shared/movie.model';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MovieDetailsComponent implements OnInit, AfterViewChecked {
  error: boolean = false;

  movie: MovieObject;
  movieId: number;
  vote_average: number;
  poster_path: string;
  backdrop_path: string;
  original_title: string;
  release_date: string;
  casts;
  homepage: string;
  overview: string;
  popularity: number;
  runtime: any;
  vote_count: number;
  genres: Array<Object>;
  videoId: string[] = [];
  movieLiked: boolean;
  watchList: MovieObject[] = [];

  isFetching: boolean = false;
  isFetchingVid: boolean = false;

  movieWidth: number;
  movieHeight: number;
  @ViewChild('detailsContainer', { static: false })
  detailsContainer: ElementRef;

  @ViewChild('videoContainer', { static: false })
  videoContainer: ElementRef;

  recommendedMovies: Array<MovieObject>;
  recommendedMoviesRating: Array<number>;
  recommendedMoviesPoster: string[];
  recommendedMoviesId: number[];
  recommendedMoviesNames: string[];
  recommendedMoviesLength;

  movieRatingColor;

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
    private moviesService: MoviesService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.movieId = +param['id'];
    });

    this.isFetching = true;
    this.moviesService.isFetching.next(this.isFetching);

    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      this.moviesService.getForComponent().subscribe((userData) => {
        this.watchList = userData.data().watchList;
        this.getMovies();
      });
    } else {
      this.watchList = this.moviesService.getLikedMovies();
      this.getMovies();
    }

    this.authService.clearWatchList.subscribe((status) => {
      this.watchList = [];
      this.getMovies();
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  getMovies() {
    this.httpService.getMovieDetails(this.movieId).subscribe({
      next: (movieData) => {
        this.isFetching = false;
        this.moviesService.isFetching.next(this.isFetching);

        this.movie = movieData;
        this.vote_average = movieData.vote_average;
        this.poster_path = movieData.poster_path;
        this.backdrop_path = movieData.backdrop_path;
        this.original_title = movieData.original_title;
        this.release_date = movieData.release_date;
        this.casts = movieData.casts;
        this.casts.splice(6);
        this.homepage = movieData.homepage;
        this.overview = movieData.overview;
        this.popularity = movieData.popularity;
        this.runtime = movieData.runtime;
        this.vote_count = movieData.vote_count;
        this.genres = movieData.genres;
        this.movieLiked = movieData.liked;

        if (this.watchList.some((item) => item.id == this.movie.id)) {
          this.movie['liked'] = true;
          this.movieLiked = this.movie['liked'];
        }

        this.moviesService.getRecent(movieData);
      },
      error: (error) => {
        if (error) {
          this.error = true;
          this.isFetching = false;
          this.moviesService.isFetching.next(this.isFetching);
        }
      },
    });

    this.httpService.getVideo(this.movieId).subscribe((movieKey) => {
      this.videoId = movieKey;
    });

    this.httpService.getSimilar(this.movieId).subscribe({
      next: (movieData) => {
        this.recommendedMovies = movieData.movies;
        this.recommendedMoviesPoster = movieData.moviePosterPaths;
        this.recommendedMoviesRating = movieData.movieRatings;
        this.recommendedMoviesId = movieData.movieIds;
        this.recommendedMoviesNames = movieData.movieNames;
        this.recommendedMoviesLength = this.recommendedMovies.length;

        this.recommendedMovies.forEach((movie) => {
          if (this.watchList.some((item) => item.id == movie.id)) {
            movie['liked'] = true;
          }
        });
      },
    });
  }

  ngAfterViewChecked(): void {
    this.movieWidth = this.detailsContainer.nativeElement.offsetWidth;

    if (this.movieWidth >= 480) {
      this.movieHeight = 600;
    }
    if (this.movieWidth <= 470) {
      this.movieHeight = 350;
    }
  }

  addOrRemoveLiked(e, id, movie) {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user != null) {
      movie['liked'] = !movie['liked'];

      const movieContainer = e.target.parentElement.parentElement;
      const posterInDetails = e.target.parentElement.parentElement;

      if (movie['liked'] == true) {
        this.moviesService.onLike(movie, id);
        if (movie.id == this.movieId) {
          this.movieLiked = movie['liked'];
        }

        movieContainer.classList.add('showAdd');
        posterInDetails.classList.add('showAdd');

        setTimeout(() => {
          movieContainer.classList.remove('showAdd');
          posterInDetails.classList.remove('showAdd');
        }, 650);
      } else {
        this.moviesService.onDisLike(id);

        if (movie.id == this.movieId) {
          this.movieLiked = movie['liked'];
        }

        movieContainer.classList.add('showRemove');
        posterInDetails.classList.add('showRemove');

        setTimeout(() => {
          movieContainer.classList.remove('showRemove');
          posterInDetails.classList.remove('showRemove');
        }, 650);
      }
    } else {
      this.router.navigate(['/', 'sign-in']);
    }
  }
}
