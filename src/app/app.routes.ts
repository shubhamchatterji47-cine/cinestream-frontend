// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
    // ← changed from '/home' to '/login'
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./features/movies/movie-list/movie-list/movie-list.component').then(m => m.MovieListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'movies/:id',
    loadComponent: () =>
      import('./features/movies/movie-detail/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'watchlist',
    loadComponent: () =>
      import('./features/watchlist/watchlist/watchlist.component').then(m => m.WatchlistComponent),
    canActivate: [authGuard]
  },
  // { path: '**', redirectTo: '/home' }
  
  // ← changed from '/home' to '/login'
  { path: '**', redirectTo: '/login' }
];