import { DoCheck, Component, OnInit, AfterViewChecked } from '@angular/core';

import { MoviesService } from '../services/movies.service';
import { MovieObject, RefinedResponse } from '../shared/movie.model';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit, AfterViewChecked, DoCheck {
  sortValue: string = 'all';
  error: boolean = false;

  movieObj!: RefinedResponse;
  searchState: boolean;
  searchName!: string;
  isRecentAvailable: boolean = false;

  isFetching: boolean = false;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.moviesService.isFetching.subscribe((state) => {
      this.isFetching = state;
    });

    this.moviesService.errorOcurred.subscribe((error) => {
      this.error = error;
    });

    this.moviesService.sortValue.subscribe((value) => (this.sortValue = value));

    this.searchState = this.moviesService.searchState;

    this.moviesService.moviesSearch.subscribe((data) => {
      this.movieObj = data;
    });
  }

  ngAfterViewChecked(): void {}
  ngDoCheck(): void {
    if (localStorage.getItem('currentSearch')) {
      this.searchName = localStorage.getItem('currentSearch');
    }

    this.moviesService.isFetching.subscribe((state) => {
      this.isFetching = state;
    });

    if (JSON.parse(localStorage.getItem('recents')) != null) {
      this.isRecentAvailable = true;
    } else {
      this.isRecentAvailable = false;
    }
  }

  clearRecent() {
    if (confirm('Are you sure you want to clear all recently viewed movies?')) {
      this.moviesService.clearRecent();
    }
  }
}
