import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MoviesComponent } from './movies/movies.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { HeaderComponent } from './header/header.component';

import { FavoriteMoviesComponent } from './movies/favorite-movies/favorite-movies.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ImagePreloader } from './shared/image-preloader.directive';
import { RecentSearchesComponent } from './recent-searches/recent-searches.component';
import { LazyLoadImagesDirective } from './shared/lazy-loading.directive';
import { RatingColorPipe } from './shared/rating-color.pipe';
import { RuntimePipe } from './shared/runtime.pipe';
import { MovieTypeComponent } from './movies/movie-type/movie-type.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ShortenTextPipe } from './shared/shorten-text.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    MoviesComponent,
    MovieDetailsComponent,
    HeaderComponent,
    FavoriteMoviesComponent,
    PageNotFoundComponent,
    ImagePreloader,
    RecentSearchesComponent,
    LazyLoadImagesDirective,
    RatingColorPipe,
    RuntimePipe,
    MovieTypeComponent,
    SearchResultComponent,
    ShortenTextPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    YouTubePlayerModule,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
