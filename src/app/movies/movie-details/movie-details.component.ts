import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  vote_average;
  poster_path;
  backdrop_path;
  original_title;
  release_date;
  casts;
  homepage;
  overview;
  popularity;
  runtime;
  vote_count;
  genres;
  videoId: string[];

  isFetching: boolean = false;
  isFetchingVid: boolean = false;

  movieWidth: number;
  @ViewChild('detailsContainer', { static: false })
  detailsContainer: ElementRef;

  @ViewChild('videoContainer', { static: false })
  videoContainer: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
    private moviesService: MoviesService,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.movieId = +param['id'];
    });

    this.isFetching = true;
    this.moviesService.isFetching.next(this.isFetching);
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
        this.homepage = movieData.homepage;
        this.overview = movieData.overview;
        this.popularity = movieData.popularity;
        this.runtime = movieData.runtime;
        this.vote_count = movieData.vote_count;
        this.genres = movieData.genres;
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
  }

  ngAfterViewChecked(): void {
    this.movieWidth = this.detailsContainer.nativeElement.offsetWidth;
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
