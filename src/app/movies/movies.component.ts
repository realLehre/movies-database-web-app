import { DoCheck, Component, OnInit } from '@angular/core';

import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit, DoCheck {
  sortValue: string = 'all';
  error: boolean = false;

  searchState: boolean;
  searchName: string;

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
  }

  ngDoCheck(): void {
    this.moviesService.isFetching.subscribe((state) => {
      this.isFetching = state;
    });

    this.moviesService.searchName.subscribe((name) => {
      this.searchName = name;
    });
  }
}
