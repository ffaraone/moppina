import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the KeyTextPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'keyText',
})
export class KeyTextPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    switch (value) {
      case '{space}':
        return '';
      case '{123}':
        return '123';
      case '{ABC}':
        return 'ABC';
      case '{#+=}':
        return '#+=';
      default:
        return value;
    }
  }
}
