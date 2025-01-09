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

@Component({
  selector: 'app-slider',
  imports: [CategoryCardComponent],
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
  },
})
export class SliderComponent {
  private elementRef = inject(ElementRef);
  show = model<boolean>(false);
  categoryChange = output<string>();

  protected categories = [
    {
      name: 'canteen',
      icon: 'icon-[mdi--restaurant]',
      color: 'orange-500', // Warm and inviting, like food
    },
    {
      name: 'office',
      icon: 'icon-[guidance--office]',
      color: 'blue-600', // Professional and corporate
    },
    {
      name: 'amphi',
      icon: 'icon-[fluent-emoji-high-contrast--post-office]',
      color: 'purple-400', // Educational and academic
    },
    {
      name: 'market center',
      icon: 'icon-[solar--shop-linear]',
      color: 'pink-500', // Vibrant and commercial
    },
    {
      name: 'toilet',
      icon: 'icon-[emojione-monotone--toilet]',
      color: 'gray-400', // Neutral and utilitarian
    },
    {
      name: 'health center',
      icon: 'icon-[lucide--hospital]',
      color: 'teal-400', // Calming and medical
    },
    {
      name: 'library',
      icon: 'icon-[famicons--library-sharp]',
      color: 'green-500', // Knowledgeable and growth-oriented
    },
    {
      name: 'printing spot',
      icon: 'icon-[el--print]',
      color: 'indigo-500', // Technical and productive
    },
    {
      name: 'labs',
      icon: 'icon-[entypo--lab-flask]',
      color: 'blue-500', // Scientific and experimental
    },
    {
      name: 'classroom blocks',
      // icon: 'icon-[icon-park-outline--blackboard]',
      icon: 'icon-[game-icons--teacher]',
      color: 'yellow-500', // Bright and educational
    },
    {
      name: 'faculties',
      icon: 'icon-[ph--building-apartment-light]',
      color: 'purple-600', // Academic and authoritative
    },
    {
      name: 'administrative blocks',
      icon: 'icon-[icomoon-free--office]',
      color: 'gray-600', // Professional and administrative
    },
    {
      name: 'sport pitches',
      icon: 'icon-[material-symbols--sports-and-outdoors]',
      color: 'green-600', // Active and energetic
    },
    {
      name: 'UB hostels',
      icon: 'icon-[ic--baseline-holiday-village]',
      color: 'brown-500', // Warm and residential
    },
  ];
  protected currentCategory = '';

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const isClicked = this.elementRef.nativeElement.contains(event.target);

    if (!isClicked && this.show()) {
      this.show.set(false);
    }
  }
}
