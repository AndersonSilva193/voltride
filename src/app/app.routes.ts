import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Volt Ride | Mobilidade elétrica',
    loadComponent: () => import('./pages/home').then((m) => m.Home),
  },
  {
    path: 'loja',
    title: 'Volt Ride | Mobilidade elétrica',
    loadComponent: () => import('./pages/shop').then((m) => m.Shop),
  },
  {
    path: 'produto/:id',
    loadComponent: () => import('./pages/product').then((m) => m.ProductPage),
  },
  { path: '**', redirectTo: '' },
];
