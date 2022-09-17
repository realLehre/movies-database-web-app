import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-recent-searches',
  templateUrl: './recent-searches.component.html',
  styleUrls: ['./recent-searches.component.scss'],
})
export class RecentSearchesComponent implements OnInit, AfterViewChecked {
  searchNames: string[] = [];
  height;

  @ViewChild('recents', { static: false })
  recents: ElementRef;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private moviesService: MoviesService
  ) {}

  ngOnInit(): void {
    this.searchNames = JSON.parse(localStorage.getItem('searchNames'));

    if (JSON.parse(localStorage.getItem('searchNames')).length > 5) {
      this.searchNames.splice(5);
    }
  }

  ngAfterViewChecked(): void {
    this.height = this.recents.nativeElement.offsetHeight;
  }

  searchRecent(name: string) {
    this.httpService.searchMovies(name).subscribe({
      next: (data) => {
        this.moviesService.searchedMovies(data);

        this.moviesService.searchName.next(name);
      },
      error: (err) => {
        if (err) {
        }
      },
    });

    this.router.navigate(['movies', 'search', name]);

    this.moviesService.searching.next(false);
  }

  closeRecents() {
    this.moviesService.searching.next(false);
  }

  removeSearch(index) {
    this.moviesService.removeSearchName(index);
    this.searchNames = JSON.parse(localStorage.getItem('searchNames'));
    if (JSON.parse(localStorage.getItem('searchNames')).length == 0) {
      this.moviesService.searching.next(false);
    }
  }

  clearSearch() {
    if (confirm('Clear all search?')) {
      this.searchNames = [];
      localStorage.setItem('searchNames', JSON.stringify([]));
      this.moviesService.searching.next(false);
    }
  }
}
