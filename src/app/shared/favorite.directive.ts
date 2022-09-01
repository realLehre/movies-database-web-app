import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';
import { MoviesService } from '../services/movies.service';

@Directive({
  selector: '[appFavorite]',
})
export class FavoriteDirective implements OnInit {
  liked: boolean;
  @HostBinding('style.color') color: string = 'white';

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.liked = JSON.parse(localStorage.getItem('likedState'));
  }

  @HostListener('click') click(eventData: Event) {
    this.liked = !this.liked;
    localStorage.setItem('likedState', JSON.stringify(this.liked));

    if (localStorage.getItem('likedState')) {
      this.liked = JSON.parse(localStorage.getItem('likedState'));
    } else {
      this.liked = !this.liked;
    }

    this.color = this.liked ? 'red' : 'white';

    this.moviesService.isLiked.next(this.liked);
  }
  @HostListener('load') onLoad(eventData: Event) {
    if (localStorage.getItem('likedState')) {
      this.liked = JSON.parse(localStorage.getItem('likedState'));
    }

    this.color = this.liked ? 'red' : 'white';

    this.moviesService.isLiked.next(this.liked);
  }
}
