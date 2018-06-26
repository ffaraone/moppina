import { Component } from '@angular/core';
import {
  IonicPage,
  LoadingController,
  NavController,
  NavParams
  } from 'ionic-angular';
import * as Mopidy from 'mopidy';



@IonicPage()
@Component({
  selector: 'page-browse',
  templateUrl: 'browse.html',
})
export class BrowsePage {

  mopidy: Mopidy;
  mopidyOnline: boolean = false;
  loading: any;
  loadingVisible = false;

  providers: any[] = [];

  constructor(
    private navCtrl: NavController, 
    private loadCtrl: LoadingController,
    private navParams: NavParams) {
      this.mopidy = new Mopidy({
        webSocketUrl: 'ws://mappina.velasuci.com:6680/mopidy/ws/'
      });
      this.mopidy.on('state:offline', () => {
        this.mopidyOnline = false;
        this.showLoading();
      });
      this.mopidy.on('state:online', () => {
        this.mopidyOnline = true;
        this.mopidy.library.browse(null)
          .then((refs) => {
            console.log(refs);
            for (let ref of refs) {
              if (ref.uri.startsWith('spotify')) {
                ref.icon = 'custom-spotify';
              } else if (ref.uri.startsWith('dirble')) {
                ref.icon = 'md-radio';
              } else if (ref.uri.startsWith('tunein')) {
                ref.icon = 'custom-tunein';
              } else if (ref.uri.startsWith('podcast+file')) {
                ref.icon = 'custom-podcast';
              } else if (ref.uri.startsWith('podcast+itunes')) {
                ref.icon = 'custom-itunes';
              } else if (ref.uri.startsWith('file')) {
                ref.icon = 'custom-file-audio';
              } else {
                ref.icon = 'musical-notes';
              }
            }
            this.providers = refs;
          });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrowsePage');
  }
  showLoading() {
    if (!this.loadingVisible) {
      this.loadingVisible = true;
      this.loading = this.loadCtrl.create({ content: 'Waiting for Mopidy to go online...'});
      this.loading.present();
    }
  }
  hideLoading() {
    if (this.loadingVisible) {
      this.loadingVisible = false;
      this.loading.dismiss();
    }
  }
  showResults(provider) {
    this.navCtrl.push('BrowseResultsPage', {ref: provider});
  }
}
