import { MopidyProvider } from '../../providers/mopidy/mopidy';
import { SettingsProvider } from '../../providers/settings/settings';
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Events } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-now-playing',
  templateUrl: 'now-playing.html',
})
export class NowPlayingPage {

  mopidyOnline: boolean = false;
  backgroundImage: string = '../../assets/imgs/background2.jpg';

  constructor(
    private events: Events, 
    public mp: MopidyProvider,
    private settings: SettingsProvider) {
    this.settings.getBackgroundImage().subscribe(val => this.backgroundImage = val);
    this.events.subscribe('mopidy:connection:offline', () => this.mopidyOnline = false);
    this.events.subscribe('mopidy:connection:online', () => this.mopidyOnline = true);
  }
}
