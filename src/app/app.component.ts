import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { Subscription } from 'rxjs';

import { MoviesService } from './services/movies.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'movies-database-app';
  isLoading: boolean = true;
  obs: Subscription;

  constructor(private router: Router, private moviesService: MoviesService) {}

  ngOnInit() {
    // setTimeout(() => {
    //   this.router.events.subscribe((event: Event) => {
    //     if (event instanceof NavigationStart) {
    //       this.isLoading = true;
    //       console.log(this.isLoading);
    //     } else if (
    //       event instanceof NavigationEnd ||
    //       event instanceof NavigationCancel ||
    //       event instanceof NavigationError
    //     ) {
    //       this.isLoading = false;
    //       console.log(this.isLoading);
    //     }
    //   });
    // }, 2000);

    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.isLoading = true;
          console.log(this.isLoading);

          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.isLoading = false;
          console.log(this.isLoading);

          break;
        }
        default: {
          break;
        }
      }
    });

    this.moviesService.search.subscribe((data) => {
      // console.log(data);
      this.moviesService.searchResult(data);
    });
  }

  ngOnDestroy(): void {
    // this.obs.unsubscribe();
  }
}
