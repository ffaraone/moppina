import { LastFmProvider } from '../../providers/last-fm/last-fm';
import { MopidyProvider } from '../../providers/mopidy/mopidy';
import { getArtistName, getTrackCodec } from '../../utils/index';
import { Component } from '@angular/core';
import {
  IonicPage,
  LoadingController,
  NavController,
  NavParams
  } from 'ionic-angular';
import { Events } from 'ionic-angular';
import * as Mopidy from 'mopidy';


const DEFAULT_ALBUM_ART = 'assets/imgs/default.png';

@IonicPage()
@Component({
  selector: 'page-now-playing',
  templateUrl: 'now-playing.html',
})
export class NowPlayingPage {

  mopidyOnline: boolean = false;
  backgroundImage: string = '../../assets/imgs/background2.jpg';

  constructor(private events: Events, public mp: MopidyProvider) {
    this.events.subscribe('mopidy:connection:offline', () => this.mopidyOnline = false);
    this.events.subscribe('mopidy:connection:online', () => this.mopidyOnline = true);
  }
}
