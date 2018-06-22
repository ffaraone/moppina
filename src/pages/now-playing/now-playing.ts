import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as Mopidy from 'mopidy';

/**
 * Generated class for the NowPlayingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-now-playing',
  templateUrl: 'now-playing.html',
})
export class NowPlayingPage {

  mopidy: Mopidy;

  backgroundImage: string = '../../assets/imgs/background2.jpg';
  playPauseIcon: string = 'play';
  trackLength: number = 100;
  trackSeekPos: number = 0;
  trackName: string = '';

  currentState: string = '';

  volume: number = 0;
  //btnPlayEnabled: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.mopidy = new Mopidy({
      webSocketUrl: 'ws://mappina.velasuci.com:6680/mopidy/ws/'
    });
    //this.mopidy.on(console.log.bind(console));
    this.mopidy.on('state:online', () => {
      this.mopidy.mixer.getVolume().then(vol => this.volume = vol);
      this.mopidy.playback.getState().then((state) => {
        this.currentState = state;
        this.playPauseIcon = state === 'playing' ? 'pause': 'play';
      });
      this.mopidy.playback.getCurrentTrack().then((track) => {
        console.log('current track');
        console.log(track);
        if (!track) {
          this.trackLength = 100;
          this.trackSeekPos = 0;
          return;      
        }
        this.trackLength = track.length;
        this.trackName = track.name;
          setInterval(() => {
            this.mopidy.playback.getTimePosition().then((val) => {
              this.trackSeekPos = val;
            });
          }, 1000);
          this.configureEventHandlers();
      })
      .catch((err) => {
        console.log('catch');
        console.log(err);
      })
      .done((d) => {
        console.log('done');
        console.log(d);
      });
    });


  }

  playPause() {
    if (this.currentState === 'playing') {
      this.mopidy.playback.pause();
    } else {
      this.mopidy.playback.play();
    }
  }
  next() {
    this.mopidy.playback.next();
  }
  previous() {
    this.mopidy.playback.previous();
  }

  configureEventHandlers() {
    // this.mopidy.on('track_playback_started', (track) => {
    //   console.log('track playback started: ' + JSON.stringify(track, null, 4));
    // });
    this.mopidy.on('event:trackPlaybackStarted', (data) => {
      if (data.tl_track) {
        this.trackLength = data.tl_track.track.length;
        this.trackName = data.tl_track.track.name;
      }
    });
    this.mopidy.on('event:volumeChanged', (vol) => {
      this.volume = vol.volume;
    });
    this.mopidy.on('event:playbackStateChanged', (state) => {
      console.log('playback state changed ' + state);
      this.currentState = state.new_state;
      if (state.new_state === 'playing') {
        this.playPauseIcon = 'pause';
      } else {
        this.playPauseIcon = 'play';
      }
    });
    this.mopidy.on('event:trackPlaybackPaused', (data) => {
      this.trackLength = data.tl_track.track.length;
      this.trackSeekPos = data.time_position;
    });
    this.mopidy.on('event:trackPlaybackResumed', (data) => {
      this.trackLength = data.tl_track.track.length;
      this.trackSeekPos = data.time_position;
    });
    this.mopidy.on('event:seeked', (data) => {
      this.trackSeekPos = data.time_position;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NowPlayingPage');
  }
  changeVolume() {
    console.log('changing volume');
    this.mopidy.mixer.setVolume(this.volume);
  }
  seek() {
    console.log('seek');
    this.mopidy.playback.seek(this.trackSeekPos);
  }
}
