import { KeyboardComponent } from './keyboard/keyboard';
import { PipesModule } from '../pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [KeyboardComponent],
	imports: [HttpClientModule, IonicModule, PipesModule],
	exports: [KeyboardComponent]
})
export class ComponentsModule {}
