import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'absolut'
})
export class AbsolutPipe implements PipeTransform {
  transform(value: number): number {
    return Math.abs(value);
  }
}
