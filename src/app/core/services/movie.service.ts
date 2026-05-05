// src/app/core/services/movie.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieListResponse, MovieDetail } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly apiUrl = `${environment.apiUrl}/api/movies`;

  constructor(private http: HttpClient) {}

  getTrending(page = 1): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(`${this.apiUrl}/trending`, {
      params: new HttpParams().set('page', page)
    });
  }

  getPopular(page = 1): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(`${this.apiUrl}/popular`, {
      params: new HttpParams().set('page', page)
    });
  }

  getTopRated(page = 1): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(`${this.apiUrl}/top-rated`, {
      params: new HttpParams().set('page', page)
    });
  }

  getNowPlaying(page = 1): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(`${this.apiUrl}/now-playing`, {
      params: new HttpParams().set('page', page)
    });
  }

 search(query: string, page = 1): Observable<MovieListResponse> {
  return this.http.get<MovieListResponse>(`${this.apiUrl}/search`, {
    params: new HttpParams().set('name', query).set('page', page)
  });
}

  getDetail(id: number): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(`${this.apiUrl}/${id}`);
  }

  getByGenre(genreId: number, page = 1): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(`${this.apiUrl}/genre/${genreId}`, {
      params: new HttpParams().set('page', page)
    });
  }
}
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { MovieListResponse, MovieDetail } from '../models/models';
// import { environment } from '../../../environments/environment';

// @Injectable({ providedIn: 'root' })   // ← MUST have this exactly
// export class MovieService {
//   private readonly apiUrl = `${environment.apiUrl}/api/movies`;

//   constructor(private http: HttpClient) {}

//   getTrending(page = 1): Observable<MovieListResponse> {
//     return this.http.get<MovieListResponse>(`${this.apiUrl}/trending`, {
//       params: new HttpParams().set('page', page)
//     });
//   }

//   getPopular(page = 1): Observable<MovieListResponse> {
//     return this.http.get<MovieListResponse>(`${this.apiUrl}/popular`, {
//       params: new HttpParams().set('page', page)
//     });
//   }

//   getTopRated(page = 1): Observable<MovieListResponse> {
//     return this.http.get<MovieListResponse>(`${this.apiUrl}/top-rated`, {
//       params: new HttpParams().set('page', page)
//     });
//   }

//   getNowPlaying(page = 1): Observable<MovieListResponse> {
//     return this.http.get<MovieListResponse>(`${this.apiUrl}/now-playing`, {
//       params: new HttpParams().set('page', page)
//     });
//   }

//   search(query: string, page = 1): Observable<MovieListResponse> {
//     return this.http.get<MovieListResponse>(`${this.apiUrl}/search`, {
//       params: new HttpParams().set('query', query).set('page', page)
//     });
//   }

//   getDetail(id: number): Observable<MovieDetail> {
//     return this.http.get<MovieDetail>(`${this.apiUrl}/${id}`);
//   }

//   getByGenre(genreId: number, page = 1): Observable<MovieListResponse> {
//     return this.http.get<MovieListResponse>(`${this.apiUrl}/genre/${genreId}`, {
//       params: new HttpParams().set('page', page)
//     });
//   }
// }