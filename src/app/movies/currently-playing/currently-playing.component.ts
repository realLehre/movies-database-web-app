import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { MoviesService } from 'src/app/services/movies.service';

import SwiperCore, {
  Navigation,
  Pagination,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
  Keyboard,
  SwiperOptions,
} from 'swiper';

SwiperCore.use([
  Keyboard,
  Pagination,
  Navigation,
  Virtual,
  Autoplay,
  Thumbs,
  Controller,
]);

@Component({
  selector: 'app-currently-playing',
  templateUrl: './currently-playing.component.html',
  styleUrls: ['./currently-playing.component.scss'],
})
export class CurrentlyPlayingComponent implements OnInit, AfterViewChecked {
  config: SwiperOptions = {
    loop: true,
    navigation: true,
    keyboard: {
      enabled: true,
    },
    speed: 1000,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    preloadImages: false,
    lazy: true,
  };

  configMobile: SwiperOptions = {
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    preloadImages: false,
    lazy: true,
  };

  backDrops: string[] = [];
  posters: string[] = [];
  titles: string[] = [];
  releaseDates: string[] = [];
  movieIds: number[] = [];
  isFetching: boolean = false;
  error: boolean = false;

  playingContainerWidth!: number;
  @ViewChild('playing', { static: false }) playing: ElementRef<HTMLDivElement>;
  constructor(
    private httpService: HttpService,
    private moviesService: MoviesService
  ) {}

  ngOnInit(): void {
    this.httpService.getCurrentlyPlaying().subscribe((data) => {
      this.backDrops = data.backdrops;
      this.posters = data.posters;
      this.titles = data.titles;
      this.releaseDates = data.releaseDates;
      this.movieIds = data.movieIds;
    });

    this.moviesService.isFetching.subscribe((state) => {
      this.isFetching = state;
    });

    this.moviesService.errorOcurred.subscribe((error) => {
      this.error = error;
    });
  }

  getWidth = window.addEventListener('resize', this.get);
  sliderWidth!: number;

  get() {
    this.sliderWidth = window.innerWidth;
  }

  ngAfterViewChecked(): void {
    // this.playingContainerWidth = this.playing.nativeElement.offsetWidth;
    this.get();
  }
}
