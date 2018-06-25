import { LastFmProvider } from '../../providers/last-fm/last-fm';
import { getArtistName, getTrackCodec } from '../../utils/index';
import { Component } from '@angular/core';
import {
  IonicPage,
  LoadingController,
  NavController,
  NavParams
  } from 'ionic-angular';
import * as Mopidy from 'mopidy';


const DEFAULT_ALBUM_ART = 'assets/imgs/default.png';

@IonicPage()
@Component({
  selector: 'page-now-playing',
  templateUrl: 'now-playing.html',
})
export class NowPlayingPage {

  mopidy: Mopidy;


  mopidyOnline: boolean = false;

  backgroundImage: string = '../../assets/imgs/background2.jpg';
  playPauseIcon: string = 'play';
  trackLength: number = 100;
  trackSeekPos: number = 0;
  trackName: string = '';
  trackArtist: string = '';
  trackAlbum: string = '';
  trackCodec: string = '';
  trackBitrate: string = '';
  albumArt: string = DEFAULT_ALBUM_ART;

  currentState: string = '';
  volume: number = 0;
  loading: any;
  loadingVisible: boolean = false;

  constructor(
    private navCtrl: NavController,
    private loadCtrl: LoadingController,
    private navParams: NavParams,
    private lastFM: LastFmProvider) {
    
    this.showLoading();
    this.mopidy = new Mopidy({
      webSocketUrl: 'ws://mappina.velasuci.com:6680/mopidy/ws/'
    });
    this.mopidy.on(console.log.bind(console));
    this.mopidy.on('state:offline', () => {
      this.showLoading();
    });
    this.mopidy.on('state:online', () => {
      this.hideLoading();
      this.mopidyOnline = true;
      this.mopidy.mixer.getVolume().then(vol => this.volume = vol);
      this.mopidy.playback.getState().then((state) => {
        this.currentState = state;
        this.playPauseIcon = state === 'playing' ? 'pause': 'play';
      });
      this.mopidy.playback.getCurrentTrack().then((track) => {
        if (!track) {
          this.trackLength = 100;
          this.trackSeekPos = 0;
          return;      
        }
        this.trackLength = track.length;
        this.trackName = track.name;
        this.trackAlbum = track.album.name;
        this.trackArtist = getArtistName(track);
        this.trackCodec = getTrackCodec(track.uri);
        this.trackBitrate = track.bitrate/1000 + ' kbit/s';
        this.getAlbumArt(track);
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
  showLoading() {
    if (!this.loadingVisible) {
      this.loadingVisible = true;
      this.loading = this.loadCtrl.create({ content: 'Waiting for Mopidy to became online...'});
      this.loading.present();
    }
  }
  hideLoading() {
    if (this.loadingVisible) {
      this.loadingVisible = false;
      this.loading.dismiss();
    }

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

  getAlbumArt(track) {
    this.mopidy.library.getImages([track.uri]).then((imageResults) => {
      for (const uri in imageResults) {
        if (imageResults[uri].length > 0) {
          console.log(imageResults[uri]);
          return;
        }
      }
      this.lastFM.getAlbumArt(track)
        .then(res => this.albumArt = res)
        .catch((err) => {
          this.albumArt = DEFAULT_ALBUM_ART;
          console.log(err);
        });
    });
  }

  configureEventHandlers() {
    // this.mopidy.on('track_playback_started', (track) => {
    //   console.log('track playback started: ' + JSON.stringify(track, null, 4));
    // });
    this.mopidy.on('event:trackPlaybackStarted', (data) => {
      if (data.tl_track) {
        const track = data.tl_track.track;
        this.trackLength = track.length;
        this.trackName = track.name;
        this.trackAlbum = track.album.name;
        this.trackArtist = getArtistName(track);
        this.trackCodec = getTrackCodec(track.uri);
        this.trackBitrate = track.bitrate/1000 + ' kbit/s';
        this.getAlbumArt(track);
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
      console.log(data.tl_track.track.uri);
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
