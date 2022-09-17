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
  error: boolean = false;
  searching: boolean = false;

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

    this.moviesService.getSearchNames();

    if (this.searchForm.invalid) {
      return null;
    } else {
      this.router.navigate(['movies', 'search', search]);

      this.httpService.searchMovies(search).subscribe({
        next: (data) => {
          this.moviesService.searchedMovies(data);

          this.moviesService.searchName.next(search);
        },
        error: (err) => {
          if (err) {
            this.error = true;
          }
        },
      });

      this.router.navigate(['movies', 'search', search]);

      this.moviesService.searching.next(false);
    }

    this.searchForm.reset();
  }

  check() {
    if (JSON.parse(localStorage.getItem('searchNames')).length == 0) {
      this.moviesService.searching.next(false);
    } else {
      this.moviesService.searching.next(true);
    }
  }
}
