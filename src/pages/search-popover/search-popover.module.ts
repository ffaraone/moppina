import { SearchPopoverPage } from './search-popover';
import { ComponentsModule } from '../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    SearchPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPopoverPage),
    ComponentsModule
  ],
})
export class SearchPopoverPageModule {}
