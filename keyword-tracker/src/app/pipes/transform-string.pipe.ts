import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'transformString'
})
export class TransformString implements PipeTransform {
  transform(string: string): string {
    if (string) {
      string = string.replace(environment.mainUrl, '');
      return string;
    }
    return '';
  }
}
