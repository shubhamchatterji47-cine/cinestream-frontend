// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { WatchlistItem } from '../models/models';
// import { environment } from '../../../environments/environment';

// @Injectable({ providedIn: 'root' })   // ← must be here
// export class WatchlistService {
//   private readonly apiUrl = `${environment.apiUrl}/api/watchlist`;

//   constructor(private http: HttpClient) {}

//   getWatchlist(): Observable<WatchlistItem[]> {
//     return this.http.get<WatchlistItem[]>(this.apiUrl);
//   }

//   addToWatchlist(
//     tmdbMovieId: number,
//     movieTitle: string,
//     posterPath: string
//   ): Observable<WatchlistItem> {
//     return this.http.post<WatchlistItem>(this.apiUrl, {
//       tmdbMovieId,
//       movieTitle,
//       posterPath
//     });
//   }

//   removeFromWatchlist(tmdbMovieId: number): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/${tmdbMovieId}`);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WatchlistItem {
  id: number;
  tmdbMovieId: number;
  movieTitle: string;
  posterPath: string;
  addedAt: string;
}

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private readonly apiUrl = `${environment.apiUrl}/api/watchlist`;

  constructor(private http: HttpClient) {}

  getWatchlist(): Observable<WatchlistItem[]> {
    return this.http.get<WatchlistItem[]>(this.apiUrl);
  }

  addToWatchlist(
    tmdbMovieId: number,
    movieTitle: string,
    posterPath: string
  ): Observable<WatchlistItem> {
    return this.http.post<WatchlistItem>(this.apiUrl, {
      tmdbMovieId,
      movieTitle,
      posterPath
    });
  }

  removeFromWatchlist(tmdbMovieId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${tmdbMovieId}`);
  }
}