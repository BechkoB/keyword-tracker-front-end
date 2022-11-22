import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CtrTransform'
})
export class CtrTransform implements PipeTransform {
  transform(num: number | undefined): string | undefined {
    if (num) {
      const newNum = num * 100;
      return newNum.toFixed(2) + '%';
    }
    return '0';
  }
}
