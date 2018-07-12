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
      case '{alt}':
        return 'alt';
      case '{space}':
        return '';
      default:
        return value;
    }
  }
}
