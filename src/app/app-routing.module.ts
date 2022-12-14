import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { FavoriteMoviesComponent } from './movies/favorite-movies/favorite-movies.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoute: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'movies' },
  { path: 'movies/favorites', component: FavoriteMoviesComponent },
  {
    path: 'movies',
    component: HomepageComponent,
  },

  { path: 'movies/search/:movie-name', component: HomepageComponent },

  { path: 'movies/:id/:details', component: MovieDetailsComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoute)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
