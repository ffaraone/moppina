import { NgControl } from '../../../node_modules/@angular/forms';
import { KeyboardComponent } from '../../components/keyboard/keyboard';
import { EventEmitter, Input, Optional } from '@angular/core';
import {
  AfterViewInit,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  HostListener,
  Output,
  ViewContainerRef
  } from '@angular/core';

  import { TextInput } from "ionic-angular";

@Directive({
  selector: 'ion-input[keyboard]'
})
export class KeyboardDirective implements AfterViewInit {

  keyboard: KeyboardComponent;

  inputElement: HTMLInputElement = null;
  ionicElement: TextInput = null;

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
    @Optional() private ngControl: NgControl) {
  }

  @HostListener('ionFocus')
  onFocus() {
    const pos = this.currentValue.length;
    this.inputElement.setSelectionRange(pos, pos);
    if (this.keyboard.visible) {
      return;
    }
    this.keyboard.visible = true;
    this.keyboardStateChange.emit('show');
  }

  @HostListener('keyup', ["$event"])
  onkeyup(evt: KeyboardEvent) {
    if (evt && evt.keyCode === 13) {
      this.doEnter();
      return;
    }
    this.currentValue = this.inputElement.value;
  }


  ngAfterViewInit() {
    let element = this.elementRef.nativeElement;
    this.ionicElement = this.elementRef.nativeElement as TextInput;
    this.inputElement = element.getElementsByTagName('input')[0];
    this.loadComponent();
  }

  updateValue() {
    if (this.ngControl) {
      this.ngControl.viewToModelUpdate(this.currentValue);
      this.ngControl.valueAccessor.writeValue(this.currentValue);
    } else {
      // this.ionicElement.value = this.currentValue;
      this.inputElement.value = this.currentValue;
    }
  }

  doEnter() {
    this.keyboard.visible = false;
    this.keyboardStateChange.emit('hide');
    this.enter.emit(this.currentValue);
  }
  doBksp() {
    if (this.currentValue.length > 0) {
      this.currentValue = this.currentValue.slice(0, this.currentValue.length - 1);
      this.updateValue();
    }
  }

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
            this.doBksp();
            break;
          case '{enter}':
            this.doEnter();
            break;
          default:
            this.currentValue += key;
            this.updateValue();
            break;
        } 
      }
    )
  }
}
