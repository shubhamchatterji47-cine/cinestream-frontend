// src/app/shared/components/movie-card/movie-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../core/models/models';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="movie-card" [routerLink]="['/movies', movie.id]">
      <div class="poster-wrap">
        <img
          [src]="movie.posterUrl || 'assets/no-poster.png'"
          [alt]="movie.title"
          loading="lazy"
          class="poster"
        />
        <div class="overlay">
          <button class="btn-watch">▶ Details</button>
          <button
            class="btn-watchlist"
            (click)="toggleWatchlist($event)"
            [class.added]="isInWatchlist"
            [title]="isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'"
          >
            {{ isInWatchlist ? '✓' : '+' }}
          </button>
        </div>
        <div class="rating">
          <span class="star">★</span>
          {{ movie.voteAverage | number:'1.1-1' }}
        </div>
      </div>
      <div class="info">
        <h3 class="title">{{ movie.title }}</h3>
        <span class="year">{{ movie.releaseDate | slice:0:4 }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() isInWatchlist = false;
  @Output() watchlistToggled = new EventEmitter<Movie>();

  toggleWatchlist(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.watchlistToggled.emit(this.movie);
  }
}