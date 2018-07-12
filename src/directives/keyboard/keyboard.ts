import { NgControl } from '../../../node_modules/@angular/forms';
import { KeyboardComponent } from '../../components/keyboard/keyboard';
import { EventEmitter, Input } from '@angular/core';
import {
  AfterViewInit,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  HostListener,
  Output,
  Renderer,
  ViewContainerRef
  } from '@angular/core';

/**
 * Generated class for the KeyboardDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[keyboard]' // Attribute selector
})
export class KeyboardDirective implements AfterViewInit {

  keyboard: KeyboardComponent;

  inputElement: HTMLInputElement = null;

  currentValue: string = '';

  @Output()
  enter: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  keyboardStateChange: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  keyboardColor: string = 'primary';


  constructor(private elementRef: ElementRef, 
    private viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private ngControl: NgControl,
    private renderer: Renderer) {
  }

  @HostListener('focus')
  onFocus() {
    const pos = this.currentValue.length;
    this.inputElement.setSelectionRange(pos, pos);
    console.log('on focus from directive');
    if (this.keyboard.visible) {
      return;
    }
    this.currentValue = '';
    this.ngControl.valueAccessor.writeValue(this.currentValue);
    this.keyboard.visible = true;
    this.keyboardStateChange.emit('show');
  }

  ngAfterViewInit() {
    let element = this.elementRef.nativeElement;
    if (element.tagName === 'INPUT') {
      console.log('element is htmlinput');
      this.inputElement = element;
    } else {
      console.log('element is ioninput');
      this.inputElement = element.getElementsByTagName('input')[0];
    }
    this.loadComponent();
  }

  // private getInput() {
  //   return this.elInput.nativeElement.children[0];
  // }
  // doBksp() {
  //   if (this.htmlInput.value && this.htmlInput.value.length > 0) {
  //     this.htmlInput.value = this.htmlInput.value.substr(0, this.htmlInput.value.length - 2);
  //   }
  // }
  // addChar(key) { 
  //   const ionInputEle:BaseInput<string>  = this.elInput.nativeElement;
  //   ionInputEle.value = 'ciccio';
  //   //this.getInput().value += key;
  //   // this.htmlInput.value += key;
  // }

  // setInputValue() {
  //   this.renderer.setElementProperty(this.inputElement, 'value', this.currentValue);
  // }
  

  loadComponent() {
    let factory = this.resolver.resolveComponentFactory(KeyboardComponent);
    let componentRef = this.viewContainerRef.createComponent(factory);
    this.keyboard = (<KeyboardComponent>componentRef.instance);
    console.log(this.keyboardColor);
    this.keyboard.color = this.keyboardColor;
    this.keyboard.keyPressed.subscribe(
      key => {
        console.log(key);
        switch (key) {
          case '{bksp}':
            if (this.currentValue.length > 0) {
              this.currentValue = this.currentValue.slice(0, this.currentValue.length - 1);
              this.ngControl.valueAccessor.writeValue(this.currentValue);
            }
            // this.doBksp();
            break;
          case '{enter}':
            this.keyboard.visible = false;
            this.keyboardStateChange.emit('hide');
            this.enter.emit(this.currentValue);
            break;
          default:
            this.currentValue += key;
            this.ngControl.valueAccessor.writeValue(this.currentValue);
            break;
        } 
      }
    )
  }
}
