import { MopidyProvider } from '../../providers/mopidy/mopidy';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  searchText: string = '';
  resultsVisible: boolean = false;

  constructor(public mp: MopidyProvider) {
  }

  ionViewDidLoad() {
    // this.mp.search('The Beatles').then((res) => console.log(res));
  }
  search() {
    console.log(this.searchText);
  }
  onKeyboardStateChange(state) {
    console.log(state);
    this.resultsVisible = state === 'hide';
  }
}

