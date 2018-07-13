import { MopidyProvider } from '../../providers/mopidy/mopidy';
import { Component, NgZone, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  Content,
  IonicPage,
  NavController,
  NavParams
  } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-browse-results',
  templateUrl: 'browse-results.html',
})
export class BrowseResultsPage {

  @ViewChild(Content) content: Content;

  refs: any[] = [];
  currentRef: any;
  loadingArts: boolean = true;

  constructor(
    private navCtrl: NavController, 
    private asCtrl: ActionSheetController,
    private navParams: NavParams,
    private zone: NgZone,
    public mp: MopidyProvider) {
  }

  ionViewDidLoad() {
    this.currentRef = this.navParams.get('ref');
    this.browseUri();

  }

  private fixSpotifyWebUris(uri) {
    if (!uri.startsWith('spotifyweb')) {
      return uri;
    }
    const pieces = uri.split(':');
    if (pieces.length >=2) {
      const res = ['spotify'];
      res.push(...pieces.splice(pieces.length - 2));
      return res.join(':');
    }
    return uri;
  }

  private getArts(): Promise<null> {
    return new Promise<null>((resolve, reject) => {
      this.mp.getAlbumArts(this.refs.map(val => val.uri)).then(images => {
        console.log(images);
        this.zone.run(() => {
          for (let r of this.refs) {
            const sanitizedUri = this.fixSpotifyWebUris(r.uri);
            if (sanitizedUri in images && images[sanitizedUri].length > 0) {
              r.albumArt = images[sanitizedUri][0].uri;
            }
          }
          this.loadingArts = false;
        });
        // for (let r of this.refs) {
        //   const sanitizedUri = this.fixSpotifyWebUris(r.uri);
        //   if (sanitizedUri in images && images[sanitizedUri].length > 0) {
        //     r.albumArt = images[sanitizedUri][0].uri;
        //   }
        // }
        // this.content.resize();
      });
    });
  }

  browseUri() {
    this.mp.browse(this.currentRef.uri).then(refs => {
      for (const r of refs) {
        r.albumArt = '';
      }
      this.refs = refs;
      this.getArts();
    });
  }

  showOptions(ref) {
    let actionSheet = this.asCtrl.create({
      title: 'What you want to do ?',
      buttons: [
        {
          text: 'Add to queue',
          handler: () => {
            this.mp.appendQueue(ref.uri);
          }
        },
        {
          text: 'Clear queue and play',
          handler: () => {
            this.mp.clearAndPlayQueue(ref.uri);
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
  browseOrPlay(ref) {
    if (ref.type === 'directory' || ref.type === 'album' || ref.type === 'artist') {
      this.mp.browseState.breadcrumb.push(ref.name);
      this.navCtrl.push('BrowseResultsPage', {ref: ref});
    } else {
      this.mp.appendAndPlay(ref.uri);
    } 
  }
  back() {
    this.mp.browseState.breadcrumb.pop();
    this.navCtrl.pop();
  }
}
