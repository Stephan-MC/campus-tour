import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { isPlatformBrowser, NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  linkedSignal,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { SliderComponent } from '../common/components/slider/slider.component';
import { FormsModule } from '@angular/forms';
import { MapService } from '../common/services/map.service';
import { locations, categories } from './data/coordinates.json';
import { Location } from '../common/types/location';

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
export class HomePage implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private mapService = inject(MapService);
  private mapRef = viewChild.required<ElementRef<HTMLDivElement>>('mapRef');

  private comboBoxRef = viewChild<ElementRef<HTMLDivElement>>('comboBoxRef');
  private selectedCategory = signal('');
  showComboBox = signal(false);
  menu = false;
  searching = false;
  search = '';

  // TODO: Implement frequently visited places
  markers: Array<google.maps.marker.AdvancedMarkerElement> = [];
  protected categories = categories;

  filteredLocations = signal<Array<Location>>([]);
  selectedLocations = linkedSignal(() =>
    locations.filter(
      (location) => location.category === this.selectedCategory(),
    ),
  );

  constructor() {
    effect(() => {
      if (this.selectedLocations().length > 0) {
        const center = {
          max: {
            lat: -Infinity,
            lng: -Infinity,
          },
          min: {
            lat: Infinity,
            lng: Infinity,
          },
        };

        this.selectedLocations().forEach((location) => {
          if (location.coordinate.lat >= center.max.lat) {
            center.max.lat = location.coordinate.lat;
          }

          if (location.coordinate.lng >= center.max.lng) {
            center.max.lng = location.coordinate.lng;
          }

          if (location.coordinate.lat <= center.min.lat) {
            center.min.lat = location.coordinate.lat;
          }

          if (location.coordinate.lng <= center.min.lng) {
            center.min.lng = location.coordinate.lng;
          }

          if (this.selectedLocations()?.length == 1) {
            center.max = {
              lng: location.coordinate.lng,
              lat: location.coordinate.lng,
            };
            center.min = {
              lng: location.coordinate.lng,
              lat: location.coordinate.lng,
            };
          }

          this.markers.forEach((marker) => {
            marker.map = null;
          });

          const category =
            categories[location.category as keyof typeof categories];
          const glyph = document.createElement('div');
          glyph.classList.add('map-glyph');
          glyph.style.backgroundColor = `color-mix(in oklab, var(--color-${category.color}) 50%, transparent)`;
          glyph.innerHTML = `<i class="${category.icon} text-lg pt-px" style="color: var(--color-white)" role="img" aria-hidden="true"></i>`;

          this.mapService
            .addAdvancedMarker({
              position: location.coordinate,
              title: location.name,
              pin: {
                glyph,
                glyphColor: 'yellow',
                background: 'transparent',
                borderColor: 'transparent',
              },
            })
            .then((marker) => this.markers.push(marker));
        });

        this.mapService.setCenter({
          lat: (center.max.lat + center.min.lat) / 2,
          lng: (center.max.lng + center.min.lng) / 2,
        });
      }
    });
  }

  ngOnInit() {
    this.mapService.loadMap({
      id: 'UB',
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.mapService.initMap(this.mapRef().nativeElement, {
        center: {
          lat: 4.149944,
          lng: 9.287684,
        },
        restriction: {
          latLngBounds: {
            north: 4.155404,
            west: 9.280921,
            east: 9.2952,
            south: 4.142207,
          },
          strictBounds: true,
        },
        zoom: 15,
        mapId: 'DEMO_MAP_ID',
        styles: [
          {
            featureType: 'all',
            elementType: 'all',
            stylers: [
              {
                visibility: 'off',
              },
            ],
          },
          {
            featureType: 'poi',
            elementType: 'all',
            stylers: [
              {
                visibility: 'off',
              },
            ],
          },
        ],
      });

      navigator.geolocation.watchPosition(
        (position) => {
          const glyph = document.createElement('div');
          glyph.innerHTML = `<i class="icon-[mdi--map-marker-account-outline] text-lg pt-px text-primary" role="img" aria-hidden="true"></i>`;

          this.mapService.addAdvancedMarker({
            position: {
              lng: position.coords.longitude,
              lat: position.coords.latitude,
            },
            title: 'Your current Position',
            pin: {
              glyph,
              glyphColor: 'var(--color-primary)',
              background: 'transparent',
            },
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              // TODO: Notify the user the location permission was denied
              break;

            case error.POSITION_UNAVAILABLE:
              // TODO: Notify the user the location is unavailable
              break;

            case error.TIMEOUT:
              // TODO: Notify the user the location request timed out
              break;

            default:
            // TODO: Notify the user an unknown error occurred
          }
        },
        { enableHighAccuracy: true },
      );
    }
  }

  handleSearch() {
    this.showComboBox.set(!!this.search.length);

    this.filteredLocations.set(
      this.search.length
        ? (locations as Array<Location>)
            .filter(
              (l) =>
                l.name.toLowerCase().includes(this.search.toLowerCase()) ||
                (this.search.length >= 2 &&
                  l.block.toLowerCase().includes(this.search.toLowerCase())) ||
                (this.search.length >= 2 &&
                  l.category.includes(this.search.toLowerCase())),
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

  selectLocationsBy(category: string) {
    this.selectedCategory.set(category);
  }

  removeAllMarkers() {
    this.markers.forEach((marker) => {
      marker.map = null;
    });

    this.markers = [];
  }
}
