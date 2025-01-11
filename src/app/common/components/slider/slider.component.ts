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
import { CategoryCardComponent } from '../category-card/category-card.component';
import { categories } from '../../../home/data/coordinates.json';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-slider',
  imports: [CategoryCardComponent, KeyValuePipe],
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
  host: {
    '[@menu]': "show() ? 'open' : 'close'",
    '[class]':
      "'fixed block z-9999 inset-x-0 supports-dvh:max-h-[80dvh] mobile:supports-dvh:max-h-[80dvh] mobile:max-h-[80%] tablet:max-h-[50%] tablet:supports-dvh:max-h-[50dvh]'",
  },
})
export class SliderComponent {
  private elementRef = inject(ElementRef);
  show = model<boolean>(false);
  categoryChange = output<string>();

  protected categories = categories;
  protected currentCategory = '';

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const isClicked = this.elementRef.nativeElement.contains(event.target);

    if (!isClicked && this.show()) {
      this.show.set(false);
    }
  }
}
