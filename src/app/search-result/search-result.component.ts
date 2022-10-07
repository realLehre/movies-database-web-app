import {
  Component,
  ElementRef,
  OnInit,
  AfterViewChecked,
  ViewChild,
} from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { MovieObject } from '../shared/movie.model';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit, AfterViewChecked {
  movies: Array<MovieObject>;
  moviesRating: Array<number>;
  moviesPoster: string[];
  moviesId: number[];
  moviesNames: string[];

  height;

  @ViewChild('textHeight', { static: false }) textHeight: ElementRef;
  pageWidth: number;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.moviesService.searchResults.subscribe({
      next: (result) => {
        this.movies = result.movies;
        this.moviesRating = result.movieRatings;
        this.moviesPoster = result.moviePosterPaths;
        this.moviesId = result.movieIds;
        this.moviesNames = result.movieNames;
      },
    });

    this.moviesService.pageWidth.subscribe({
      next: (value) => {
        this.pageWidth = value;
      },
    });
  }

  ngAfterViewChecked(): void {
    console.log(this.textHeight.nativeElement.offsetHeight);
  }

  closeSearchResult() {
    this.moviesService.clearSearch.next(true);
  }
}
