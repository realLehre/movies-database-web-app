import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FavoriteMoviesComponent } from './favorite-movies/favorite-movies.component';
import { HomepageComponent } from '../homepage/homepage.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: 'movies',
    component: HomepageComponent,
  },
  {
    path: 'movies/watchlist',
    component: FavoriteMoviesComponent,
    canActivate: [AuthGuard],
  },

  { path: 'movies/search/:movie-name', component: HomepageComponent },

  { path: 'movies/:id/:details', component: MovieDetailsComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: [],
  exports: [RouterModule],
})
export class MoviesRoutingModule {}
