import { LastFmProvider } from '../../providers/last-fm/last-fm';
import { Component } from '@angular/core';
import {
  ActionSheetController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams
  } from 'ionic-angular';
import * as Mopidy from 'mopidy';


@IonicPage()
@Component({
  selector: 'page-browse-results',
  templateUrl: 'browse-results.html',
})
export class BrowseResultsPage {


  title: string = '';

  mopidy: Mopidy;
  mopidyOnline: boolean = false;
  loading: any;
  loadingVisible = false;

  results: any[] = [];

  constructor(
    private navCtrl: NavController, 
    private loadCtrl: LoadingController,
    private asCtrl: ActionSheetController,
    private navParams: NavParams,
    private lastFM: LastFmProvider) {
      this.mopidy = new Mopidy({
        webSocketUrl: 'ws://mappina.velasuci.com:6680/mopidy/ws/'
      });
      this.mopidy.on('state:offline', () => {
        this.mopidyOnline = false;
        this.showLoading();
      });
      this.mopidy.on('state:online', () => {
        this.mopidyOnline = true;
        this.hideLoading();
        this.browseUri();
      });
  }

  ionViewDidLoad() {
    if (this.mopidyOnline) {
      this.browseUri();
    }
  }
  browseUri() {
    const ref = this.navParams.get('ref');
    console.log(ref.uri);
    this.showLoading();
    this.mopidy.library.browse(ref.uri).then((refs) => {
      this.hideLoading();
      this.title = ref.name;
      this.results = refs;
      for (let r of refs) {
        this.mopidy.library.lookup(r.uri).then((tltracks) => {
          if (r.uri.startsWith('spotifyweb')) {
            console.log(tltracks);
          }
          this.getAlbumArt(r, tltracks);
        });
      }
    });
  }
  showLoading() {
    if (!this.loadingVisible) {
      this.loadingVisible = true;
      this.loading = this.loadCtrl.create({ content: 'Loading...'});
      this.loading.present();
    }
  }
  hideLoading() {
    if (this.loadingVisible) {
      this.loadingVisible = false;
      this.loading.dismiss();
    }
  }
  showOptions(ref) {
    let actionSheet = this.asCtrl.create({
      title: 'What you want to do ?',
      buttons: [
        {
          text: 'Add to queue',
          handler: () => {
            this.mopidy.tracklist.add(null, null, ref.uri).then((tl_track) => {
            });
          }
        },
        {
          text: 'Clear queue and play',
          handler: () => {
            this.mopidy.tracklist.clear()
              .then(() => {
                this.mopidy.tracklist.add(null, null, ref.uri).then((tl_track) => {
                  console.log(tl_track);
                  this.mopidy.playback.play(null, tl_track.tlid);
                });
              });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();    
  }
  showResults(ref) {
    if (ref.type === 'directory' || ref.type === 'album' || ref.type === 'artist') {
      this.navCtrl.push('BrowseResultsPage', {ref: ref});
    } else {
      this.mopidy.tracklist.add(null, null, ref.uri).then((tl_track) => {
        this.mopidy.playback.play(null, tl_track.tlid);
      });
    } 
  }
  getAlbumArt(ref, tltracks): Promise<any> {
    console.log('get album art for uri ' + ref.uri);
    return new Promise<any>((resolve, reject) => {
      this.mopidy.library.getImages([ref.uri]).then((imageResults) => {
        for (const uri in imageResults) {
          if (imageResults[uri].length > 0) {
            ref.album_art = imageResults[uri][0]['uri'];
            resolve()
            return;
          }
        }
        if (tltracks && tltracks instanceof Array && tltracks.length > 0) {
          console.log('lookup lastfm for album art');
          this.lastFM.getAlbumArt(tltracks[0])
          .then(res => {
            ref.album_art = res;
            resolve();
          })
          .catch((err) => {
            console.log(err);
            resolve();   
          });
        } else {
          resolve();
        }
      });
    })
  }
}
