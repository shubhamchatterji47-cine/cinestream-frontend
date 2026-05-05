import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WatchlistService } from './../../../core/services/watchlist.service';
import { WatchlistItem } from './../../../core/models/models';
import { NavbarComponent } from './../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {
  items: WatchlistItem[] = [];
  loading = true;

  constructor(private watchlistService: WatchlistService) {}

  ngOnInit(): void {
    this.loadWatchlist();
  }

  loadWatchlist(): void {
    this.watchlistService.getWatchlist().subscribe(items => {
      this.items = items;
      this.loading = false;
    });
  }

  remove(item: WatchlistItem): void {
    this.watchlistService.removeFromWatchlist(item.tmdbMovieId).subscribe(() => {
      this.items = this.items.filter(i => i.id !== item.id);
    });
  }

  posterUrl(path: string): string {
    return path
      ? `https://image.tmdb.org/t/p/w500${path}`
      : 'assets/no-poster.png';
  }
}