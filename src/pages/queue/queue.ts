import { LastFmProvider } from '../../providers/last-fm/last-fm';
import { getArtistName } from '../../utils/index';
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
  selector: 'page-queue',
  templateUrl: 'queue.html',
})
export class QueuePage {




  tracks: any[] = [];
  mopidy: Mopidy;
  mopidyOnline: boolean = false;
  loading: any;
  loadingVisible = false;

  constructor(
    private navCtrl: NavController,
    private loadCtrl: LoadingController,
    private navParams: NavParams,
    private lastFM: LastFmProvider) {
    this.mopidy = new Mopidy({
      webSocketUrl: 'ws://mappina.velasuci.com:6680/mopidy/ws/'
    });
    // this.mopidy.on(console.log.bind(console));
    this.mopidy.on('state:offline', () => {
      this.mopidyOnline = false;
      this.showLoading();
    });
    this.mopidy.on('state:online', () => {
      this.mopidyOnline = true;
      this.getTracklist();
      this.configureEventHandlers();
    });
  }

  showLoading() {
    if (!this.loadingVisible) {
      this.loadingVisible = true;
      this.loading = this.loadCtrl.create({ content: 'Be patient...'});
      this.loading.present();
    }
  }
  hideLoading() {
    if (this.loadingVisible) {
      this.loadingVisible = false;
      this.loading.dismiss();
    }
  }

  getTracklist() {
    this.showLoading();
    this.tracks = [];
    this.mopidy.tracklist.getTlTracks()
    .then((tracks) => {
      const promises: Promise<any>[] = [];
      for (const t of tracks) {
        promises.push(this.getAlbumArt(t));
      }
      this.mopidy.playback.getCurrentTlTrack().then((currentTrack) => {
        Promise.all(promises)
        .then((tltracks) => {
          for (const tl of tltracks) {
            this.tracks.push({
              name: tl.track.name,
              album_art: tl.track.moppina_album_art,
              album: tl.track.album ? tl.track.album.name : '',
              artist: getArtistName(tl.track),
              tlid: tl.tlid,
              current: currentTrack.tlid === tl.tlid
            });
          }
          this.hideLoading();
        });
      });
    });
  }

  configureEventHandlers() {
    this.mopidy.on('event:trackPlaybackStarted', (data) => {
      if (data.tl_track) {
        for (const t of this.tracks) {
          t.current = t.tlid === data.tl_track.tlid;
        }
      }
    });
    this.mopidy.on('event:tracklistChanged', () => {
      this.getTracklist();
    });
  }
  
  getAlbumArt(tltrack): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.mopidy.library.getImages([tltrack.track.uri]).then((imageResults) => {
        for (const uri in imageResults) {
          if (imageResults[uri].length > 0) {
            tltrack.track.moppina_album_art = imageResults[uri][0]['uri'];
            resolve(tltrack)
            return;
          }
        }
        this.lastFM.getAlbumArt(tltrack.track)
          .then(res => {
            tltrack.track.moppina_album_art = res;
            resolve(tltrack);
          })
          .catch((err) => {
            console.log(err);
            tltrack.track.moppina_album_art = DEFAULT_ALBUM_ART;
            resolve(tltrack);
            
          });
      });
    })
  }
  playTrack(track) {
    this.mopidy.playback.play(null, track.tlid);
  }
  ionViewDidLoad() {
    if (this.mopidyOnline) {
      this.getTracklist();
    }    
  }
  reorder(indexes) {
    this.mopidy.tracklist.move(indexes.from, indexes.from, indexes.to)
      .then(() => {
        console.log('track moved');
      });
  }
  clear() {
    this.mopidy.tracklist.clear();
  }
  shuffle() {
    this.mopidy.tracklist.shuffle();
  }
}
