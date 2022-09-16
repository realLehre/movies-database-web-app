import {
  AfterContentChecked,
  AfterViewChecked,
  Component,
  DoCheck,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HttpService } from '../services/http.service';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomepageComponent implements OnInit {
  sort: string;

  search: boolean;

  searchState: boolean;

  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.search = param['movie-name'] ? true : false;
      this.moviesService.search.next(this.search);

      this.searchState = param['movie-name'] ? true : false;
    });

    this.search = this.moviesService.searchState;

    this.moviesService.isLoading.next(false);
  }

  onSort(sort) {
    this.moviesService.sortValue.next(sort);
  }
}
