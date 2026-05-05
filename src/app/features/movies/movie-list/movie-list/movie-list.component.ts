import { NavbarComponent } from './../../../../shared/components/navbar/navbar.component';
// src/app/features/movies/movie-list/movie-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from './../../../../core/services/movie.service';
import { WatchlistService } from './../../../../core/services/watchlist.service';
import { Movie, WatchlistItem } from './../../../../core/models/models';
import { MovieCardComponent } from './../../../../shared/components/movie-card/movie-card.component';
// import { Router } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';

const CATEGORIES = [
  { key: 'trending',    label: '🔥 Trending' },
  { key: 'popular',     label: '🌟 Popular' },
  { key: 'top-rated',   label: '⭐ Top Rated' },
  { key: 'now-playing', label: '🎭 Now Playing' },
];

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCardComponent, NavbarComponent],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  categories = CATEGORIES;
  activeCategory = 'trending';
  searchQuery = '';
  isSearching = false;
  currentPage = 1;
  totalPages = 1;
  loading = true;
  watchlistIds = new Set<number>();

  constructor(
    private movieService: MovieService,
    private watchlistService: WatchlistService,
    private route: ActivatedRoute,
 private router: Router // ADD THIS
    
  ) {}

  // ngOnInit(): void {
  //   this.route.queryParams.subscribe(params => {
  //     if (params['q']) {
  //       this.searchQuery = params['q'];
  //       this.isSearching = true;
  //       this.loadSearch();
  //     } else if (params['category']) {
  //       this.activeCategory = params['category'];
  //       this.loadCategory();
  //     } else {
  //       this.loadCategory();
  //     }
  //   });

  //   this.watchlistService.getWatchlist().subscribe(items => {
  //     this.watchlistIds = new Set(items.map((i: WatchlistItem) => i.tmdbMovieId));
  //   });
  // }
  ngOnInit(): void {
  // 🔥 THIS IS THE CODE YOU ASKED ABOUT
  this.route.queryParams.subscribe(params => {
    if (params['q']) {
      this.searchQuery = params['q'];
      this.isSearching = true;
      this.loadSearch();
    }
    //  else if (params['category']) {
    //   this.activeCategory = params['category'];
    //   this.loadCategory();
    // }
     else {
      this.loadCategory();
    }
  });

  // Watchlist (leave as it is)
  this.watchlistService.getWatchlist().subscribe(items => {
    this.watchlistIds = new Set(items.map((i: WatchlistItem) => i.tmdbMovieId));
  });
}

  selectCategory(key: string): void {
    this.activeCategory = key;
    this.isSearching = false;
    this.searchQuery = '';
    this.currentPage = 1;
    // this.loadSearch();
    this.loadCategory();
    // this.onSearch();
  }

  // loadCategory(): void {
  //   this.loading = true;
  //   const obs$ = {
  //     trending: this.movieService.getTrending(this.currentPage),
  //     popular: this.movieService.getPopular(this.currentPage),
  //     'top-rated': this.movieService.getTopRated(this.currentPage),
  //     'now-playing': this.movieService.getNowPlaying(this.currentPage),
  //   }[this.activeCategory] ?? this.movieService.getTrending(this.currentPage);

  //   obs$.subscribe(res => {
  //     this.movies = res.results;
  //     this.totalPages = res.totalPages;
  //     this.loading = false;
  //   });
  // }
loadCategory(): void {
  this.loading = true;

  const obs$ = {
    trending: this.movieService.getTrending(this.currentPage),
    popular: this.movieService.getPopular(this.currentPage),
    'top-rated': this.movieService.getTopRated(this.currentPage),
    'now-playing': this.movieService.getNowPlaying(this.currentPage),
  }[this.activeCategory]|| this.movieService.getTrending(this.currentPage);

  obs$?.subscribe({
    next: (res: any) => {
      console.log('CATEGORY RESPONSE:', res);

      this.movies = res.results || res.Results || [];
      this.totalPages = res.totalPages || res.TotalPages || 1;

      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}
  // onSearch(): void {
  //   if (!this.searchQuery.trim()) return;
  //   this.isSearching = true;
  //   this.currentPage = 1;
  //   this.loadSearch();
  // }
onSearch(): void {
  if (!this.searchQuery.trim()) return;

  this.router.navigate([], {
    queryParams: { q: this.searchQuery },
    queryParamsHandling: 'merge'
  });
}
  // loadSearch(): void {
  //   this.loading = true;
  //   this.movieService.search(this.searchQuery, this.currentPage).subscribe(res => {
  //     this.movies = res.results;
  //     this.totalPages = res.totalPages;
  //     this.loading = false;
  //   });
  // }
 loadSearch(): void {
  this.loading = true;

  this.movieService.search(this.searchQuery, this.currentPage).subscribe({
    next: (res: any) => {
      console.log('FULL RESPONSE:', res);

      // Handle both cases
      this.movies = res.results || res.Results || [];

      this.totalPages = res.totalPages || res.TotalPages || 1;

      this.loading = false;
    },
    error: (err) => {
      console.error('Search ERROR:', err);
      this.loading = false;
    }
  });
}
  changePage(page: number): void {  
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (this.isSearching) this.loadSearch();
    else this.loadCategory();
  }

  isInWatchlist(movieId: number): boolean {
    return this.watchlistIds.has(movieId);
  }

  // toggleWatchlist(movie: Movie): void {
  //   if (this.watchlistIds.has(movie.id)) {
  //     this.watchlistService.removeFromWatchlist(movie.id).subscribe(() => {
  //       this.watchlistIds.delete(movie.id);
  //     });
  //   } else {
  //     this.watchlistService.addToWatchlist(movie.id, movie.title, movie.posterPath || '').subscribe(() => {
  //       this.watchlistIds.add(movie.id);
  //     });
  //   }
  // }
toggleWatchlist(movie: Movie): void {
  console.log('CLICKED MOVIE:', movie); // 👈 ADD THIS

  if (this.watchlistIds.has(movie.id)) {
    this.watchlistService.removeFromWatchlist(movie.id).subscribe(() => {
      this.watchlistIds.delete(movie.id);
    });
  } else {
    this.watchlistService.addToWatchlist(
      movie.id,
      movie.title,
      movie.posterPath || ''
    ).subscribe(() => {
      this.watchlistIds.add(movie.id);
    });
  }
}
  get pages(): number[] {
    const range = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  }
}