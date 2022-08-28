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
import { MovieObject } from 'src/app/shared/movie.model';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MovieDetailsComponent implements OnInit, AfterViewChecked {
  movie: MovieObject;
  movieId: number;
  rating: number;
  moviePoster: string;
  movieBackdrop: string;
  movieTitle: string;
  movieRelease_date: string;

  movieWidth: number;
  @ViewChild('videoContainer', { static: true })
  videoContainer: ElementRef<HTMLDivElement>;

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.movieId = +param['id'];
    });

    this.httpService.getMovieDetails(this.movieId).subscribe((movieData) => {
      this.movie = movieData;
      this.rating = Math.floor(movieData.vote_average * 10);
      this.moviePoster = `https://image.tmdb.org/t/p/original${movieData.poster_path}`;
      this.movieBackdrop = `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`;
      this.movieTitle = movieData.original_title;
      this.movieRelease_date = movieData.release_date;
      console.log(this.movie);
    });
  }

  ngAfterViewChecked(): void {
    this.movieWidth = this.videoContainer.nativeElement.offsetWidth;
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
