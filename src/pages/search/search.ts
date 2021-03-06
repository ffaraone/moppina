import { MopidyProvider } from '../../providers/mopidy/mopidy';
import { Component, NgZone } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  PopoverController
  } from 'ionic-angular';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  resultsVisible: boolean = false;
  results: any;
  loadingArts: boolean = true;

  query: string = '';

  constructor(
    private zone: NgZone,
    private popCtrl: PopoverController,
    public mp: MopidyProvider) {
  }

  ionViewDidLoad() {
    // this.mp.search('The Beatles').then((res) => console.log(res));
  }
  search() {
    if (this.query) {
      this.loadingArts = true;
      this.mp.search(this.query).then((res) => {
        console.log(res);
        for (let r of res) {
          if (r.uri.startsWith('tunein:search')) {
            r.title = 'TuneIn';
          } else if (r.uri.startsWith('local:search')) {
            r.title = 'Local library'
          } else if (r.uri.startsWith('spotify:search')) {
            r.title = 'Spotify';
          }
        }
        this.results = res;
        let promises = [];
        for (const r of this.results) {
          if (r.artists) {
            promises.push(this.getArts(r.artists));
          }
          if (r.albums) {
            promises.push(this.getArts(r.albums));
          }
          if (r.tracks) {
            promises.push(this.getArts(r.tracks));
          }
        }
        console.log('promises '  + promises.length);
        Promise.all(promises).then(() => {
          console.log('loading arts finished');
          this.zone.run(() => {
            this.loadingArts = false;
          });
        });
      });
    }
    
  }
  onKeyboardStateChange(state) {
    this.resultsVisible = state === 'hide';
  }
  private getArts(refs): Promise<null> {
    return new Promise<null>((resolve, reject) => {
      this.mp.getAlbumArts(refs.map(val => val.uri)).then(images => {
        //this.zone.run(() => {
          for (let r of refs) {
            //const sanitizedUri = this.fixSpotifyWebUris(r.uri);
            if (r.uri in images && images[r.uri].length > 0) {
              this.zone.run(() => {
                r.albumArt = images[r.uri][0].uri;
              });
              //r.albumArt = images[r.uri][0].uri;
            }
          }
          resolve();
        });
      //});
    });
  }
  showPopover(event) {
    console.log(event);
    let popover = this.popCtrl.create('SearchPopoverPage');
    popover.onDidDismiss((data) => {
      this.query = data;
      this.search();
    });
    popover.present({ev: event});
  }
}

