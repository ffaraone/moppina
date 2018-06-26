import { Injectable } from '@angular/core';

@Injectable()
export class ConfigProvider {

  constructor() {
  }

  getMopidyUrl() {
    return 'ws://mophile.velasuci.com:6680/mopidy/ws/';
  }

}
