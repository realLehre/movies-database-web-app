import {
  AfterViewChecked,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MoviesService } from '../services/movies.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomepageComponent implements OnInit, AfterViewChecked {
  sort: string;
  search: boolean;
  searchState: boolean;
  watchListCount: number;
  isLoggedIn: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.search = param['movie-name'] ? true : false;
      this.moviesService.search.next(this.search);

      this.searchState = param['movie-name'] ? true : false;
    });

    this.search = this.moviesService.searchState;
  }

  ngAfterViewChecked(): void {
    const watchListStorage = JSON.parse(localStorage.getItem('liked'));
    if (watchListStorage != null) {
      this.watchListCount = JSON.parse(localStorage.getItem('liked')).length;
    }
    this.authService.userWatchList.subscribe((data) => {
      this.watchListCount = 0;
    });
  }

  getCount() {
    this.watchListCount = this.watchListCount;
  }

  onSort(sort) {
    this.moviesService.sortValue.next(sort);
  }

  closeRecents() {
    this.moviesService.searching.next(false);
  }
}
