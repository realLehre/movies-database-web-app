import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rating',
})
export class RatingColorPipe implements PipeTransform {
  transform(value: any, rating: number) {
    if (rating < 51) {
      return '#DC143C';
    } else if (rating < 70) {
      return 'yellow';
    } else {
      return 'green';
    }
  }
}
