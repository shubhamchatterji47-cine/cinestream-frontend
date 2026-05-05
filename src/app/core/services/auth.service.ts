// // src/app/core/services/auth.service.ts
// import { Injectable, signal } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { tap } from 'rxjs/operators';
// import { Observable } from 'rxjs';
// import { AuthResponse, LoginRequest, RegisterRequest } from '../models/models';
// import { environment } from '../../../environments/environment';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private readonly apiUrl = `${environment.apiUrl}/api/User`;

//   // Reactive signal for auth state — components can read this directly
//   isLoggedIn = signal<boolean>(this.hasValidToken());
//   currentUser = signal<{ name: string; email: string } | null>(this.getStoredUser());

//   constructor(private http: HttpClient, private router: Router) {}

//   // register(data: RegisterRequest): Observable<AuthResponse> {
//   //   return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
//   //     tap(res => this.storeAuth(res))
//   //   );
//   // }
//   register(data: any): Observable<any> {
//   return this.http.post(`${this.apiUrl}/register`, data);
// }

//   login(data: LoginRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
//       tap(res => this.storeAuth(res))
//     );
//   }

//   logout(): void {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     this.isLoggedIn.set(false);
//     this.currentUser.set(null);
//     this.router.navigate(['/login']);
//   }

//   getToken(): string | null {
//     return localStorage.getItem('token');
//   }

//   // private storeAuth(res: AuthResponse): void {
//   //   localStorage.setItem('token', res.token);
//   //   localStorage.setItem('user', JSON.stringify({ name: res.fullName, email: res.email }));
//   //   this.isLoggedIn.set(true);
//   //   this.currentUser.set({ name: res.fullName, email: res.email });
//   // }
// private storeAuth(res: any): void {
//   localStorage.setItem('token', res.token);

//   // ✅ FIX for your backend response structure
//   localStorage.setItem(
//     'user',
//     JSON.stringify({
//       name: res.user.fullName,
//       email: res.user.email
//     })
//   );

//   this.isLoggedIn.set(true);
//   this.currentUser.set({
//     name: res.user.fullName,
//     email: res.user.email
//   });
// }
//   private hasValidToken(): boolean {
//     return !!localStorage.getItem('token');
//   }

//   private getStoredUser() {
//     const stored = localStorage.getItem('user');
//     return stored ? JSON.parse(stored) : null;
//   }
// }
// src/app/core/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/User`;

  isLoggedIn = signal<boolean>(this.hasValidToken());
  currentUser = signal<{ name: string; email: string } | null>(this.getStoredUser());

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ FIXED
register(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/register`, data);
}

  // ✅ OK
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap(res => this.storeAuth(res))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ CORRECT (your fix is good)
  private storeAuth(res: any): void {
    localStorage.setItem('token', res.token);

    localStorage.setItem(
      'user',
      JSON.stringify({
        name: res.user.fullName,
        email: res.user.email
      })
    );

    this.isLoggedIn.set(true);
    this.currentUser.set({
      name: res.user.fullName,
      email: res.user.email
    });
  }

  private hasValidToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getStoredUser() {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }
}