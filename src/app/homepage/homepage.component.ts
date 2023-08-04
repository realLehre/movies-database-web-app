import {
  AfterViewChecked,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MoviesService } from '../services/movies.service';

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
    private moviesService: MoviesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.search = param['movie-name'] ? true : false;
      this.moviesService.search.next(this.search);

      this.searchState = param['movie-name'] ? true : false;
    });

    this.search = this.moviesService.searchState;

    // if (JSON.parse(localStorage.getItem('user')) != null) {
    //   this.moviesService.getForComponent().subscribe((userData) => {
    //     this.watchListCount = userData.data().watchList.length;
    //     this.getCount();
    //   });
    // } else {
    //   this.watchListCount = this.moviesService.getLikedMovies().length;
    //   this.getCount();
    // }
  }

  ngAfterViewChecked(): void {
    this.watchListCount = this.moviesService.getLikedMovies().length;
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
