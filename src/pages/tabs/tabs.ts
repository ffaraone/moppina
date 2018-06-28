import { MopidyPlaybackState } from '../../models/mopidy';
import { Component, ViewChild } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Events, IonicPage, Tabs } from 'ionic-angular';


@IonicPage()
@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {

  @ViewChild('myTabs') tabRef: Tabs;

  tabBrowse = 'BrowsePage';
  tabNowPlaying = 'NowPlayingPage';
  tabQueue = 'QueuePage';
  tabSearch = 'QueuePage';
  tabSettings = 'QueuePage';
  tabBrowseTitle = 'Browse';
  tabNowPlayingTitle = 'Now Playing';
  tabQueueTitle = 'Queue'

  loadingVisible: boolean = false;
  loading: any;

  constructor(
    private loadingCtrl: LoadingController,
    private events: Events) {
      this.configureEvents();
  }
  ionViewDidLoad() {
    this.tabRef.select(2);
  }
  private configureEvents() {
    this.events.subscribe('mopidy:playback:stateChanged', (stateInfo) => {
      if (stateInfo.new_state === MopidyPlaybackState.Playing) {
        if (this.tabRef.selectedIndex != 2) {
          this.tabRef.select(2);
        }
      }
    });
    this.events.subscribe('mopidy:connection:offline', () => this.showLoading());
    this.events.subscribe('mopidy:connection:online', () => this.hideLoading());
    this.events.subscribe('mopidy:async:loading', () => this.showLoading())
    this.events.subscribe('mopidy:async:loaded', () => this.hideLoading())

  }
  private showLoading() {
    if (!this.loadingVisible) {
      this.loadingVisible = true;
      this.loading = this.loadingCtrl.create({ content: 'Be patient please...'});
      this.loading.present();
    }
  }
  private hideLoading() {
    if (this.loadingVisible) {
      this.loadingVisible = false;
      this.loading.dismiss();
    }
  }
}
