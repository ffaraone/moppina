import { MopidyProvider } from '../../providers/mopidy/mopidy';
import { Component } from '@angular/core';
import {
  ActionSheetController,
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

  refs: any[] = [];
  currentRef: any;

  constructor(
    private navCtrl: NavController, 
    private asCtrl: ActionSheetController,
    private navParams: NavParams,
    public mp: MopidyProvider) {
  }

  ionViewDidLoad() {
    this.currentRef = this.navParams.get('ref');
    this.browseUri();

  }

      //     this.mopidy.library.lookup(r.uri).then((tracks) => {
    //       if (r.uri.startsWith('spotifyweb:yourmusic:album:')) {
    //         r.uri = 'spotify:album:' + r.uri.substring(27);
    //       } else if (r.uri.startsWith('spotifyweb:yourmusic:artist:')) {
    //         r.uri = 'spotify:artist:' + r.uri.substring(28);
    //       } else if (r.uri.startsWith('spotifyweb:sauce:artist:')) {
    //         r.uri = 'spotify:artist:' + r.uri.substring(24);
    //       } else if (r.uri.startsWith('spotifyweb:sauce:album:')) {
    //         r.uri = 'spotify:album:' + r.uri.substring(23);
    //       }
    //       if (!r.uri.startsWith('local:artist:')) {
    //         this.mp.getAlbumArt(
    //       } else {
    //         this.lastFM.getArtistPicture(r.name).then((pic) => {
    //           r.album_art = pic;
    //         });
    //       }
    //     });
    //   }
    // });

  private getArts(): Promise<null> {
    return new Promise<null>((resolve, reject) => {
      for (const r of this.refs) {
        this.mp.lookup(r.uri).then(tracks => {
          if (r.uri.startsWith('spotifyweb:yourmusic:album:')) {
            r.uri = 'spotify:album:' + r.uri.substring(27);
          } else if (r.uri.startsWith('spotifyweb:yourmusic:artist:')) {
            r.uri = 'spotify:artist:' + r.uri.substring(28);
          } else if (r.uri.startsWith('spotifyweb:sauce:artist:')) {
            r.uri = 'spotify:artist:' + r.uri.substring(24);
          } else if (r.uri.startsWith('spotifyweb:sauce:album:')) {
            r.uri = 'spotify:album:' + r.uri.substring(23);
          }
          const myRef = tracks && tracks.length > 0 ? tracks[0] : r;
          if (!r.uri.startsWith('local:artist:')) {
            this.mp.getAlbumArt(myRef).then(url => {
              r.albumArt = url;
            });
          } else {
            this.mp.getArtistPicture(r.name).then(url => {
              r.albumArt = url;
            });
          }
        });
      }
    });
  }
  browseUri() {
    this.mp.browse(this.currentRef.uri).then(refs => {
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
