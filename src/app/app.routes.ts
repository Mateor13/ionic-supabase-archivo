import { provideRouter, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'subir',
    pathMatch: 'full',
  },
  {
    path: 'subir',
    loadComponent: () => import('./pages/subir/subir.page').then( m => m.SubirPage)
  },
];

export const appRouting = provideRouter(routes);
