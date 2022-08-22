import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MoviesComponent } from './movies/movies.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    MoviesComponent,
    MovieDetailsComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
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
