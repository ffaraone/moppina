import { SettingsProvider } from '../../providers/settings/settings';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BackgroundPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-background',
  templateUrl: 'background.html',
})
export class BackgroundPage {

  backgrounds: any[] = [
    {
      name: 'Queen',
      path: 'assets/imgs/queen.jpg'
    },
    {
      name: 'Earphones',
      path: 'assets/imgs/earphones.jpg'
    },
    {
      name: 'Napoli',
      path: 'assets/imgs/napoli.jpg'
    },
    {
      name: 'Turntable',
      path: 'assets/imgs/turntable.jpg'
    },    
    {
      name: 'Vinyl shop',
      path: 'assets/imgs/vinyl-shop.jpg'
    }, 
  ];

  constructor(
    private navCtrl: NavController, 
    private settings: SettingsProvider) {
  }
  setBackground(bg) {
    this.settings.setBackgroundImage(bg.path);
    this.navCtrl.pop();
  }
  back() {
    this.navCtrl.pop();
  }
}
