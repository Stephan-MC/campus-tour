import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  signal,
  viewChild,
} from '@angular/core';
import { SliderComponent } from '../common/components/slider/slider.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [NgClass, SliderComponent, FormsModule],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  animations: [
    trigger('search', [
      state(
        'open',
        style({
          width: '*',
        }),
      ),
      state(
        'close',
        style({
          width: 0,
        }),
      ),
      transition('open <=> close', animate('1s linear')),
    ]),
  ],
})
export class HomePage {
  private comboBoxRef = viewChild<ElementRef<HTMLDivElement>>('comboBoxRef');
  showComboBox = signal(false);
  menu = false;
  searching = false;
  search = '';

  // TODO: Implement frequently visited places
  locations = [
    {
      name: "Megoze's Office",
      block: 'Old Library',
      type: 'office',
      coordingate: {
        lng: 0.0001,
        lat: 2.435434,
      },
    },
    {
      name: "Mr Mbella's Office",
      block: 'Faculty of Education',
      type: 'office',
      coordingate: {
        lng: 0.0001,
        lat: 2.435434,
      },
    },
    {
      name: 'Female toilets',
      block: 'Old Library',
      type: 'toilet',
      coordingate: {
        lng: 0.0001,
        lat: 2.435434,
      },
    },
    {
      name: 'UBlock E',
      block: 'U-Block',
      type: 'classroom',
      coordingate: {
        lng: 0.0001,
        lat: 2.435434,
      },
    },
    {
      name: 'UBlock D',
      block: 'U-Block',
      type: 'classroom',
      coordingate: {
        lng: 0.0001,
        lat: 2.435434,
      },
    },
    {
      name: 'UBlock F',
      block: 'U-Block',
      type: 'classroom',
      coordingate: {
        lng: 0.0001,
        lat: 2.435434,
      },
    },
    {
      name: 'UBlock G',
      block: 'U-Block',
      type: 'classroom',
      coordingate: {
        lng: 0.0001,
        lat: 2.435434,
      },
    },
    {
      name: 'CLRBLK II 150 A',
      block: 'Classroom Block II',
      type: 'classroom',
      coordingate: {
        lng: 0.0001,
        lat: 2.435434,
      },
    },
    {
      name: 'Staff Canteen',
      block: '',
      type: 'canteen',
      coordingate: {
        lng: 0.0001,
        lat: 2.435434,
      },
    },
    {
      name: 'Restau',
      block: 'Restau',
      type: 'canteen',
      coordingate: {
        lng: 0.0001,
        lat: 2.435434,
      },
    },
    {
      name: 'Restau I',
      block: 'Restau',
      type: 'classroom',
      coordingate: {
        lng: 0.0001,
        lat: 2.435434,
      },
    },
    {
      name: 'Restau II',
      block: 'Restau',
      type: 'classroom',
      coordingate: {
        lng: 0.0001,
        lat: 2.435434,
      },
    },
    {
      name: 'Restau III',
      block: 'Restau',
      type: 'classroom',
      coordingate: {
        lng: 0.0001,
        lat: 2.435434,
      },
    },
  ];

  filteredLocations = signal<typeof this.locations>([]);

  handleSearch() {
    this.showComboBox.set(!!this.search.length);

    this.filteredLocations.set(
      this.search.length
        ? this.locations
            .filter(
              (l) =>
                l.name.toLowerCase().includes(this.search.toLowerCase()) ||
                (this.search.length >= 2 &&
                  l.block.toLowerCase().includes(this.search.toLowerCase())) ||
                (this.search.length >= 2 &&
                  l.type.includes(this.search.toLowerCase())),
            )
            .slice(0, 7)
        : [],
    );
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const isComboBoxClicked = this.comboBoxRef()?.nativeElement.contains(
      event.target as Element,
    );
    if (!isComboBoxClicked) {
      this.showComboBox.set(false);
    }
  }
}
