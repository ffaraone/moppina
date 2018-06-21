import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tabBrowse = 'BrowsePage';
  tabNowPlaying = 'NowPlayingPage';
  tabQueue = 'QueuePage';

  tabBrowseTitle = 'Browse';
  tabNowPlayingTitle = 'Now Playing';
  tabQueueTitle = 'Queue'

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
