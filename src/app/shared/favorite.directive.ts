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
  liked: boolean = false;
  @HostBinding('style.color') color: string = 'white';

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.moviesService.isLiked.subscribe((state) => {
      this.liked = state;
    });
  }

  @HostListener('click') click(eventData: Event) {
    this.color = this.liked ? 'red' : 'white';
    console.log(this.liked);
  }
}
