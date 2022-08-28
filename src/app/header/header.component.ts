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

    if (this.searchForm.invalid) {
      return null;
    } else {
      this.moviesService.searchName.next(search);
      // this.httpService.searchMovies(search);
      this.router.navigate(['movies', 'search', search]);

      this.httpService.searchMovies(search).subscribe((data) => {
        this.moviesService.searchedMovies(data.results);

        this.moviesService.searchName.next(search);
      });

      this.router.navigate(['movies', 'search', search]);
    }

    this.searchForm.reset();
  }
}
