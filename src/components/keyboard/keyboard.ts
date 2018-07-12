import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  Output
  } from '@angular/core';
/**
 * Generated class for the KeyboardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'keyboard',
  templateUrl: 'keyboard.html'
})
export class KeyboardComponent {

  layout: any;
  currentMap: any;
  visible: boolean = false;

  shift: boolean = false;
  alt: boolean = false;


  @Output()
  keyPressed: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  color: string = 'primary';

  constructor(private http: HttpClient) {
    console.log('keyboard component constructor');
    this.http.get('assets/keyboard/layouts.json').subscribe(
      (res) => {
        this.layout = res['es'];
        this.currentMap = this.layout.base;
      },
      (err) => console.log(err)
    );
  }
  toggleShift(what) {
    this.shift = what === 'on';
    this.currentMap = this.shift ? this.layout.shift : this.layout.base;
  }
  toggleAlt(what) {
    this.alt = what === 'on';
    this.currentMap = this.alt ? this.layout.alt : this.layout.base;
  }
  buttonClicked(key) {
    console.log(this.color);
    if (this.isKey(key)) {
      this.toggleShift('off');
      this.toggleAlt('off');
      this.keyPressed.emit(key);
    } else {
      console.log(key);
      switch (key) {
        case '{shift}':
          this.toggleAlt('off');
          this.toggleShift(this.shift ? 'off': 'on');
          break;
        case '{alt}':
          this.toggleShift('off');
          this.toggleAlt(this.alt ? 'off': 'on');
          break;        
        case '{bksp}':
        case '{enter}':
          this.keyPressed.emit(key);
          break;
      }
    }
  }
  isTextButton(key) {
    return key === '{space}' || key === '{alt}' || this.isKey(key);
  }
  isKey(key) {
    return !(key.startsWith('{') && key.endsWith('}'));
  }
  isSpacerKey(key) {
    return key === '{empty}';
  }
  getSpecialButtonIcon(key) {
    switch (key) {
      case '{bksp}':
        return 'ios-backspace-outline';
      case '{tab}':
        return 'ios-arrow-round-forward-outline';
      case '{enter}':
        return 'custom-enter';
      case '{shift}':
        return 'custom-shift';
      case '{alt}':
        return 'ios-arrow-dropup-outline';
      default:
        return 'globe';
    }
  }
  getButtonClass(key) {
    switch (key) {
      case '{space}':
        return 'btn-special-xlarge';
      case '{bksp}':
      case '{enter}':
        return 'btn-special-large';
      case '{tab}':
      case '{shift}':
      case '{alt}':
        return 'btn-special';
      default:
        return 'btn-std';
    }    
  }
}
