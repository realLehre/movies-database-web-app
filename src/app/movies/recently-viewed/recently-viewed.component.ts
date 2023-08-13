import { Component, OnInit } from '@angular/core';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-recently-viewed',
  templateUrl: './recently-viewed.component.html',
  styleUrls: ['./recently-viewed.component.scss'],
})
export class RecentlyViewedComponent implements OnInit {
  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {}
}
