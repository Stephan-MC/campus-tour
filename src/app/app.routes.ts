import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'UB Campus Tourism',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
];
