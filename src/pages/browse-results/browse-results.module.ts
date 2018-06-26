import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrowseResultsPage } from './browse-results';

@NgModule({
  declarations: [
    BrowseResultsPage,
  ],
  imports: [
    IonicPageModule.forChild(BrowseResultsPage),
  ],
})
export class BrowseResultsPageModule {}
