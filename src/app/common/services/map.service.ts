import { ElementRef, Injectable } from '@angular/core';
import { Loader, LoaderOptions } from '@googlemaps/js-api-loader';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: google.maps.Map;
  private loader!: Loader;

  loadMap(options?: Omit<LoaderOptions, 'apiKey'>) {
    this.loader = new Loader({
      apiKey: 'AIzaSyAMKDOBvAjEyvrY8zAqz0buMxZOip3HL5U',
      language: 'en',
      region: 'CM',
      ...options,
    });
    console.log('loader ready', this.loader);
  }

  initMap(element: HTMLElement, options?: google.maps.MapOptions) {
    this.loader.importLibrary('maps').then(({ Map }) => {
      this.map = new Map(element, {
        ...options,
      });
    });
  }

  async addMarker(
    options: Omit<google.maps.marker.AdvancedMarkerElementOptions, 'map'>,
  ) {
    return this.loader
      .importLibrary('marker')
      .then(({ AdvancedMarkerElement, PinElement }) => {
        return new AdvancedMarkerElement({ map: this.map, ...options });
      });
  }
}
