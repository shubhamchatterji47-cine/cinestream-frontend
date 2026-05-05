// src/app/core/models/models.ts

export interface AuthResponse {
  token: string;
  fullName: string;
  email: string;
  expiresAt: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  passwordHash: string;
}

export interface LoginRequest {
  email: string;
  passwordHash: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  releaseDate: string;
  genreIds: number[];
  posterUrl: string;
  backdropUrl: string;
}

export interface MovieDetail extends Movie {
  runtime: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  genres: Genre[];
  videos?: { results: Video[] };
  credits?: { cast: CastMember[] };
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  key: string;
  site: string;
  type: string;
  official: boolean;
}

export interface CastMember {
  name: string;
  character: string;
  profilePath: string | null;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}

export interface WatchlistItem {
  id: number;
  tmdbMovieId: number;
  movieTitle: string;
  posterPath: string;
  addedAt: string;
}