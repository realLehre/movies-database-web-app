import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { SwiperModule } from 'swiper/angular';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { MoviesComponent } from './movies.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { FavoriteMoviesComponent } from './favorite-movies/favorite-movies.component';
import { MovieTypeComponent } from './movie-type/movie-type.component';
import { RouterModule } from '@angular/router';
import { ShortenTextPipe } from '../shared/shorten-text.pipe';
import { RatingColorPipe } from '../shared/rating-color.pipe';
import { RuntimePipe } from '../shared/runtime.pipe';
import { LazyLoadImagesDirective } from '../shared/lazy-loading.directive';
import { ImagePreloader } from '../shared/image-preloader.directive';
import { MaterialModule } from '../material.module';
import { MoviesRoutingModule } from './movies-routing.module';
import { CurrentlyPlayingComponent } from './currently-playing/currently-playing.component';
import { SearchedComponent } from './searched/searched.component';

@NgModule({
  declarations: [
    MoviesComponent,
    MovieDetailsComponent,
    FavoriteMoviesComponent,
    MovieTypeComponent,
    ShortenTextPipe,
    RatingColorPipe,
    RuntimePipe,
    LazyLoadImagesDirective,
    ImagePreloader,
    CurrentlyPlayingComponent,
    SearchedComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    YouTubePlayerModule,
    MoviesRoutingModule,
    NgCircleProgressModule.forRoot({
      backgroundColor: 'white',
      radius: 20,
      maxPercent: 100,
      units: ' %',
      unitsColor: '#FFFFFF',
      outerStrokeWidth: 5,
      outerStrokeColor: '#FFFFFF',
      innerStrokeColor: '#FFFFFF',
      titleColor: '#FFFFFF',
      subtitleColor: '#FFFFFF',
      showSubtitle: false,
      showInnerStroke: false,
      startFromZero: false,
    }),
    SwiperModule,
  ],
  exports: [
    MoviesComponent,
    MovieDetailsComponent,
    FavoriteMoviesComponent,
    MovieTypeComponent,
    ShortenTextPipe,
    RatingColorPipe,
    RuntimePipe,
    LazyLoadImagesDirective,
    ImagePreloader,
    CurrentlyPlayingComponent,
  ],
})
export class MoviesModule {}
