import { SettingsProvider } from '../providers/settings/settings';
import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Nav, Platform } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: string = 'TabsPage';
  selectedTheme: string = 'theme-default';

  @ViewChild(Nav) nav: Nav;

  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private settings: SettingsProvider) {
      this.settings.getTheme().subscribe(val => this.selectedTheme = val);
    platform.ready().then(() => {
      //this.nav.setRoot('TabsPage');
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

