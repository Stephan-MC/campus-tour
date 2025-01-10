import { Category } from './category';

export interface Location {
  name: string;
  block: string;
  category: keyof Category;
  coordinate: {
    lat: number;
    lng: number;
  };
}
