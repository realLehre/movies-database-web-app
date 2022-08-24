import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  searchForm: FormGroup;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private moviesService: MoviesService
  ) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchResult: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    const search = this.searchForm.value.searchResult.toLowerCase();

    this.moviesService.searchName.next(search);
    // this.httpService.searchMovies(search);
    this.router.navigate(['movies', 'search', search]);

    this.httpService.searchMovies(search).subscribe((data) => {
      this.moviesService.searchedMovies(data.results);
      // const paths = [];
      // for (const key in this.searchMovies) {
      //   paths.push(
      //     'https://image.tmdb.org/t/p/original' +
      //       this.searchMovies[key].poster_path
      //   );
      // }
      // this.searchMoviesPoster = paths;
      // const ratings = [];
      // for (const key in this.searchMovies) {
      //   ratings.push(Math.floor(this.searchMovies[key].vote_average * 10));
      // }
      // this.searchMoviesRating = ratings;
      // const ids = [];
      // for (const key in this.searchMovies) {
      //   ids.push(this.searchMovies[key].id);
      // }
      // this.searchMoviesId = ids;
    });

    this.router.navigate(['movies', 'search', search]);
  }
}
