import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';

const appRoute: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'search/:movies-search', component: HomepageComponent },
  { path: 'movies/:id', component: MovieDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoute)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
