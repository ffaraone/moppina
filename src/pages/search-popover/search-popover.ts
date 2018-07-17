import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  TextInput,
  ViewController
  } from 'ionic-angular';

/**
 * Generated class for the SearchPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-popover',
  templateUrl: 'search-popover.html',
})
export class SearchPopoverPage {

  @ViewChild('queryInput') queryInput: TextInput;


  htmlElem: HTMLInputElement;

  query: string = '';



  constructor(private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.htmlElem = this.queryInput.getNativeElement();
  }

  keyPressed(key) {
    this.query += key;
    this.queryInput.setFocus();
  }
  backspace() {
    this.query = this.query.slice(0, this.query.length - 1)
    this.queryInput.setFocus();
  }
  search() {
    this.viewCtrl.dismiss(this.query);
  }
  keyUp(evt: KeyboardEvent) {
    if (evt.keyCode === 13) {
      this.viewCtrl.dismiss(this.query);
    }
  }
}
