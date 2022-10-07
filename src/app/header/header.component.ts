import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewChecked {
  searchForm: FormGroup;
  error: boolean = false;
  searching: boolean = false;

  keyword: string;

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

  ngAfterViewChecked(): void {
    this.moviesService.clearSearch.subscribe({
      next: (value) => {
        if (value) {
          this.searchForm.reset();
        }
      },
    });
  }

  getKeyword() {
    const keyword = this.searchForm.value.searchResult.toLowerCase();

    if (keyword) {
      this.moviesService.searchKeyword.next(true);

      this.httpService.searchMovies(keyword).subscribe((data) => {
        this.moviesService.searchResults.next(data);
      });
    } else {
      this.moviesService.searchKeyword.next(false);
    }
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

      this.moviesService.searchKeyword.next(false);
    }

    this.searchForm.reset();
  }

  check() {
    if (JSON.parse(localStorage.getItem('searchNames')).length == 0) {
      this.moviesService.searching.next(false);
    } else {
      this.moviesService.searching.next(true);
    }

    this.moviesService.searchKeyword.subscribe({
      next: (value) => {
        if (value) {
          this.moviesService.clearSearch.next(false);
        }
      },
    });
    this.moviesService.searchKeyword.next(false);
  }

  closeRecents() {
    this.moviesService.searching.next(false);
    this.moviesService.searchKeyword.next(false);
    this.searchForm.reset();
  }
}
