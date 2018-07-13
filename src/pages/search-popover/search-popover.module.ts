import { SearchPopoverPage } from './search-popover';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    SearchPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPopoverPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class SearchPopoverPageModule {}
