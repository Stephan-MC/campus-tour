import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  linkedSignal,
  model,
  output,
} from '@angular/core';

@Component({
  selector: 'app-slider',
  imports: [],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  animations: [
    trigger('menu', [
      state(
        'open',
        style({
          bottom: '0',
        }),
      ),
      state(
        'closed',
        style({
          bottom: '*',
        }),
      ),
      transition('open => close', animate('300ms 200ms linear')),
      transition('close => open', animate('200ms linear')),
    ]),
  ],
})
export class SliderComponent {
  private elementRef = inject(ElementRef);
  show = model<boolean>(false);
  categoryChange = output<string>();

  protected currentCategory = '';

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const isClicked = this.elementRef.nativeElement.contains(event.target);

    if (!isClicked && this.show()) {
      this.show.set(false);
    }
  }
}
