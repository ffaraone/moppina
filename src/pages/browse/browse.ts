import { MopidyProvider } from '../../providers/mopidy/mopidy';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-browse',
  templateUrl: 'browse.html',
})
export class BrowsePage {

  constructor(
    private navCtrl: NavController, public mp: MopidyProvider) {
  }

  browse(backend) {
    this.mp.browseState.breadcrumb.push(backend.name);
    this.navCtrl.push('BrowseResultsPage', {ref: backend});
  }
}
