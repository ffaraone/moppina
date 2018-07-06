import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs/Rx';
/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {


  private backgroundImage: BehaviorSubject<string>;
  private theme: BehaviorSubject<string>;

  constructor(private storage: Storage) {
    this.backgroundImage = new BehaviorSubject('assets/imgs/turntable.jpg');
    this.theme = new BehaviorSubject('theme-default');
    this.storage.get('moppina-background')
      .then(val => {
        if (val) {
          this.setBackgroundImage(val);
        }
      });
      this.storage.get('moppina-theme')
      .then(val => {
        if (val) {
          this.setTheme(val);
        }
      });
  }
  setTheme(val) {
    this.storage.set('moppina-theme', val);
    this.theme.next(val);    
  }
  getTheme() {
    return this.theme.asObservable();
  }
  setBackgroundImage(val) {
    this.storage.set('moppina-background', val);
    this.backgroundImage.next(val);
  }

  getBackgroundImage() {
      return this.backgroundImage.asObservable();
  }
}
