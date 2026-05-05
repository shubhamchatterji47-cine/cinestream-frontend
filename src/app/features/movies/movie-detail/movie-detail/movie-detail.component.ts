import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MovieService } from './../../../../core/services/movie.service';
import { WatchlistService } from './../../../../core/services/watchlist.service';
import { MovieDetail } from './../../../../core/models/models';
import { NavbarComponent } from './../../../../shared/components/navbar/navbar.component';


@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {
  movie: MovieDetail | null = null;
  loading = true;
  isInWatchlist = false;
  trailerUrl: SafeResourceUrl | null = null;
  showTrailer = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private watchlistService: WatchlistService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.movieService.getDetail(id).subscribe(movie => {
      this.movie = movie;
      this.loading = false;
      this.setTrailer(movie);
    });

    this.watchlistService.getWatchlist().subscribe(items => {
      this.isInWatchlist = items.some((i: any) => i.tmdbMovieId === id);
    });
  }


// inject sanitizer in constructor — already there if you followed previous steps

getMovieEmbedUrl(tmdbId: number): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://vidsrc.to/embed/movie/${tmdbId}`
  );
}
  setTrailer(movie: MovieDetail): void {
    const trailer = movie.videos?.results.find(
      v => v.type === 'Trailer' && v.site === 'YouTube' && v.official
    ) || movie.videos?.results.find(v => v.site === 'YouTube');

    if (trailer) {
      this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
      );
    }
  }

  toggleWatchlist(): void {
    if (!this.movie) return;
    if (this.isInWatchlist) {
      this.watchlistService.removeFromWatchlist(this.movie.id).subscribe(() => {
        this.isInWatchlist = false;
      });
    } else {
      this.watchlistService.addToWatchlist(
        this.movie.id,
        this.movie.title,
        this.movie.posterPath || ''
      ).subscribe(() => {
        this.isInWatchlist = true;
      });
    }
  }

  formatRuntime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  formatCurrency(amount: number): string {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact'
    }).format(amount);
  }
}