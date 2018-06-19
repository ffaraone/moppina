import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as Mopidy from 'mopidy';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mopidy: Mopidy;

  volume: number = 10;

  constructor(public navCtrl: NavController) {
    this.mopidy = new Mopidy({
      webSocketUrl: 'ws://mappina.velasuci.com:6680/mopidy/ws/'
    });
    this.mopidy.on(console.log.bind(console));
  }
  play() {
    this.mopidy.playback.play()
      .then((args) => {
        console.log('then');
        console.log(args);
      })
      .catch((err) => {
        console.log('catch');
        console.log(err);
      })
      .done((d) => {
        console.log('done');
        console.log(d);
      });
  }
  stop() {
    this.mopidy.playback.stop();
  }
  changeVolume() {
    console.log(this.mopidy.mixer);
    this.mopidy.mixer.setVolume(this.volume);
  }
}
