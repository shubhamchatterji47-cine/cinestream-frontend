// src/app/shared/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MovieService } from '../../../core/services/movie.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  searchQuery = '';
  menuOpen = false;

  constructor(
    public authService: AuthService,
    private movieService: MovieService,
    private router: Router
  ) {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/movies'], { queryParams: { q: this.searchQuery.trim() } });
      this.searchQuery = '';
    }
  }

  logout(): void {
    this.authService.logout();
  }
}