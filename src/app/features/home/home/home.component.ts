import { MovieService } from './../../../core/services/movie.service';
// src/app/features/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchlistItem, WatchlistService } from './../../../core/services/watchlist.service';
import { RouterLink } from '@angular/router';
import { AuthService } from './../../../core/services/auth.service';
import { Movie } from './../../../core/models/models';
import { MovieCardComponent } from './../../../shared/components/movie-card/movie-card.component';
import { NavbarComponent } from './../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, NavbarComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  trending: Movie[] = [];
  nowPlaying: Movie[] = [];
  topRated: Movie[] = [];
  watchlistIds = new Set<number>();
  heroMovie: Movie | null = null;
  movies: any[] = [];
  loading = true;

  constructor(
    private movieService: MovieService,
    private watchlistService: WatchlistService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMovies();
    this.loadWatchlist();
  }

  // loadMovies(): void {
  //   this.movieService.getTrending().subscribe(res => {
  //     this.trending = res.results;
  //     this.heroMovie = res.results[0];
  //     this.loading = false;
  //   });

  //   this.movieService.getNowPlaying().subscribe(res => {
  //     this.nowPlaying = res.results;
  //   });

  //   this.movieService.getTopRated().subscribe(res => {
  //     this.topRated = res.results;
  //   });
  // }
  loadMovies(): void {
  this.movieService.getTrending().subscribe({
    next: (res) => {
      console.log('Trending:', res); // DEBUG
      this.trending = res.results;
      this.heroMovie = res.results[0];
      this.loading = false;
    },
    error: (err) => {
      console.error('Trending API Error:', err);
      this.loading = false;
    }
  });

  this.movieService.getNowPlaying().subscribe({
    next: (res) => {
      console.log('Now Playing:', res);
      this.nowPlaying = res.results;
    },
    error: (err) => console.error('NowPlaying Error:', err)
  });

  this.movieService.getTopRated().subscribe({
    next: (res) => {
      console.log('Top Rated:', res);
      this.topRated = res.results;
    },
    error: (err) => console.error('TopRated Error:', err)
  });
}

  loadWatchlist(): void {
    this.watchlistService.getWatchlist().subscribe(items => {
      this.watchlistIds = new Set(items.map((i:WatchlistItem) => i.tmdbMovieId));
    });
  }

  isInWatchlist(movieId: number): boolean {
    return this.watchlistIds.has(movieId);
  }

  toggleWatchlist(movie: Movie): void {
    if (this.watchlistIds.has(movie.id)) {
      this.watchlistService.removeFromWatchlist(movie.id).subscribe(() => {
        this.watchlistIds.delete(movie.id);
      });
    } else {
      this.watchlistService.addToWatchlist(movie.id, movie.title, movie.posterPath || '').subscribe(() => {
        this.watchlistIds.add(movie.id);
      });
    }
  }
}