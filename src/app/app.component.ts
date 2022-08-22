import { Component, OnInit } from '@angular/core';
import { HttpService } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'movies-database-app';

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.httpService.getMovies().subscribe((data) => {
      console.log(data);
    });
    this.httpService.getMovieVideo().subscribe((data) => {
      console.log(data);
    });
    this.httpService.getMovieDetails().subscribe((data) => {
      console.log(data);
    });
  }
}
