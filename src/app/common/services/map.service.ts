import { ElementRef, Injectable } from '@angular/core';
import { Loader, LoaderOptions } from '@googlemaps/js-api-loader';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: google.maps.Map;
  private loader!: Loader;
  private directionService!: google.maps.DirectionsService;
  private directionRenderer!: google.maps.DirectionsRenderer;

  loadMap(options?: Omit<LoaderOptions, 'apiKey'>) {
    this.loader = new Loader({
      apiKey: 'AIzaSyDjmFNFKcCPdcrqY1PbNc4yb3TLGpHeB54',
      language: 'en',
      region: 'CM',
      ...options,
    });
  }

  initMap(element: HTMLElement, options?: google.maps.MapOptions) {
    this.loader.importLibrary('maps').then(({ Map }) => {
      this.map = new Map(element, {
        mapId: google.maps.Map.DEMO_MAP_ID,
        ...options,
      });
    });
  }

  async addAdvancedMarker(
    options: Omit<google.maps.marker.AdvancedMarkerElementOptions, 'map'> & {
      pin?: google.maps.marker.PinElementOptions;
    },
  ) {
    return this.loader
      .importLibrary('marker')
      .then(({ AdvancedMarkerElement, PinElement }) => {
        if (options.pin) {
          options.content = new PinElement({ ...options.pin }).element;
        }

        delete options.pin;

        return new AdvancedMarkerElement({ map: this.map, ...options });
      });
  }

  setCenter(center: google.maps.LatLng | google.maps.LatLngLiteral) {
    this.map?.setCenter(center);
  }

  async showDirection(
    from: google.maps.LatLngLiteral | google.maps.LatLng,
    to: google.maps.LatLngLiteral | google.maps.LatLng,
  ) {
    const directionService = new google.maps.DirectionsService();
    const directionRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
    });

    return directionService
      .route({
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.WALKING,
      })
      .then((response) => {
        directionRenderer.setDirections(response);

        return directionRenderer;
      });
  }
}
