import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'Voltride — Motos Elétricas', loadComponent: () => import('./pages/home').then((m) => m.Home) },
  { path: 'loja', title: 'Loja — Voltride', loadComponent: () => import('./pages/shop').then((m) => m.Shop) },
  { path: 'produto/:id', loadComponent: () => import('./pages/product').then((m) => m.ProductPage) },
  { path: '**', redirectTo: '' },
];
