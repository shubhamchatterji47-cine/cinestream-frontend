// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { AuthService } from '../../../core/services/auth.service';  // ← 3 levels up

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent {
//   form: FormGroup;
//   loading = false;
//   error = '';
//   showPassword = false;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,   // ← injected here
//     private router: Router
//   ) {
//     this.form = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]]
//     });
//   }

//   get email() { return this.form.get('email')!; }
//   get password() { return this.form.get('password')!; }

//   onSubmit(): void {
//     if (this.form.invalid) return;
//     this.loading = true;
//     this.error = '';

//     this.authService.login(this.form.value).subscribe({
//       next: () => this.router.navigate(['/home']),
//       error: (err) => {
//         this.error = err.error?.message || 'Login failed. Please try again.';
//         this.loading = false;
//       }
//     });
//   }
// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // getters (for cleaner template usage)
  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

 onSubmit(): void {
  if (this.form.invalid) return;

  this.loading = true;
  this.error = '';

  // 🔥 FIX: match backend model
  const payload = {
    email: this.form.value.email,
    passwordHash: this.form.value.password
  };

  console.log('LOGIN PAYLOAD:', payload); // 🔍 debug

  this.authService.login(payload).subscribe({
    next: () => {
      this.loading = false;
      this.router.navigate(['/home']);
    },
//     error: (err) => {
//       // console.error('LOGIN ERROR:', err);
// if (err.status === 429) {
//       this.error = 'Too many requests. Please try again later.';
//     } else {
//       this.error =
//         err.error?.message ||
//         err.error?.title ||
//         'Invalid email or password';
//     }
//       this.loading = false;
//     }
error: (err) => {
  console.error('LOGIN ERROR:', err);

  if (err.status === 401) {
    this.error = 'Invalid email or password';
  } 
  else if (err.status === 400) {
    this.error = err.error || 'Account locked. Try again later.';
  } 
  else if (err.status === 429) {
    this.error = 'Too many attempts. Please try again later.';
  } 
  else {
    this.error = 'Something went wrong. Please try again.';
  }

  this.loading = false;
}
  });
}
}