import { KeyboardDirective } from './keyboard/keyboard';
import { ComponentsModule } from '../components/components.module';
import { KeyboardComponent } from '../components/keyboard/keyboard';
import { NgModule } from '@angular/core';
@NgModule({
	declarations: [KeyboardDirective],
	imports: [ComponentsModule],
	entryComponents: [KeyboardComponent],
	exports: [KeyboardDirective]
})
export class DirectivesModule {
	constructor() {
		console.log('directive module loaded');
	}
}
