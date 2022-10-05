import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'runtime',
})
export class RuntimePipe implements PipeTransform {
  transform(value: unknown, runtime: any): unknown {
    if (runtime < 60) {
      return runtime + 'm';
    }
    const num = runtime;
    const hours = num / 60;
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    return rhours + 'hr ' + rminutes + 'm';
  }
}
