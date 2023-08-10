import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  ActivationStart,
  ChildActivationEnd,
  NavigationEnd,
  Route,
  Router,
  RoutesRecognized,
} from '@angular/router';
import { HttpService } from '../services/http.service';
import { MoviesService } from '../services/movies.service';
import { AuthService } from '../services/auth.service';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewChecked {
  searchForm: FormGroup;
  error: boolean = false;
  searching: boolean = false;
  userName!: string;
  isUser: boolean = false;
  isShowInput: boolean = false;

  keyword: string;
  activatedRoute: any;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private moviesService: MoviesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchResult: new FormControl('', Validators.required),
    });

    this.moviesService.searching.subscribe((status) => {
      if (status == false) {
        this.isShowInput = false;
      }
    });
  }

  ngAfterViewChecked(): void {
    this.authService.user.subscribe((name) => {
      this.userName = name.displayName;
    });
    this.userName = localStorage.getItem('username')
      ? localStorage.getItem('username')
      : '';

    this.authService.isAuthenticated.subscribe((status) => {
      this.isUser = status;
    });
    const user = JSON.parse(localStorage.getItem('user'));

    this.isUser = user != null ? true : false;

    this.moviesService.clearSearch.subscribe({
      next: (value) => {
        if (value) {
          this.searchForm.reset();
        }
      },
    });
  }

  onSignOut() {
    this.authService.signOut();
  }

  getKeyword() {
    if (this.searchForm.value.searchResult != null) {
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
  }

  onSubmit() {
    const search = this.searchForm.value.searchResult.toLowerCase();

    this.moviesService.getSearchNames();

    if (this.searchForm.invalid) {
      return null;
    } else {
      this.moviesService.isFetching.next(true);
      this.moviesService.searching.next(false);

      this.httpService.searchMovies(search).subscribe({
        next: (data) => {
          this.moviesService.searchedMovies(data);
          this.moviesService.moviesSearch.next(data);
          this.moviesService.searchKeyword.next(false);
          this.moviesService.isFetching.next(false);

          this.moviesService.searchName.next(search);
          localStorage.setItem('currentSearch', search);
          this.router.navigate(['movies', 'search', search]);

          this.isShowInput = false;

          this.searchForm.reset();
        },
        error: (err) => {
          if (err) {
            this.error = true;
          }
        },
      });
    }
  }

  check() {
    const searchNames = JSON.parse(localStorage.getItem('searchNames'));
    if (searchNames) {
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
  }

  closeRecents() {
    this.moviesService.searching.next(false);
    this.moviesService.searchKeyword.next(false);
    this.searchForm.reset();
  }

  showInput() {
    this.isShowInput = true;
  }
}
