import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenText',
})
export class ShortenTextPipe implements PipeTransform {
  transform(value: unknown, overview: string, pageWidth: number): unknown {
    let newOverview;

    if (overview.length <= 200 && pageWidth > 10) {
      return value;
    }

    if (pageWidth < 10) {
      newOverview = overview.substring(0, 60) + '...';
    } else {
      newOverview = overview.substring(0, 200) + '...';
    }

    return newOverview;
  }
}
