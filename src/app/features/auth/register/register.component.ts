// // src/app/features/auth/register/register.component.ts
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { AuthService } from '../../../core/services/auth.service';

// function passwordMatch(control: AbstractControl) {
//   const pw = control.get('password')?.value;
//   const confirm = control.get('confirmPassword')?.value;
//   return pw === confirm ? null : { mismatch: true };
// }

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.scss']
// })
// export class RegisterComponent {
//   form: FormGroup;
//   loading = false;
//   error = '';

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router
//   ) {
//     this.form = this.fb.group({
//       fullName: ['', [Validators.required, Validators.minLength(2)]],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       confirmPassword: ['', Validators.required]
//     }, { validators: passwordMatch });
//   }

//   get fullName() { return this.form.get('fullName')!; }
//   get email() { return this.form.get('email')!; }
//   get password() { return this.form.get('password')!; }
//   get confirmPassword() { return this.form.get('confirmPassword')!; }

//   onSubmit(): void {
//     if (this.form.invalid) { this.form.markAllAsTouched(); return; }
//     this.loading = true;
//     this.error = '';

//     const { fullName, email, password } = this.form.value;
//     this.authService.register({ fullName, email, password }).subscribe({
//       next: () => this.router.navigate(['/home']),
//       error: (err) => {
//         this.error = err.error?.message || 'Registration failed.';
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
  Validators,
  AbstractControl
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// ✅ Password match validator
function passwordMatch(control: AbstractControl) {
  const pw = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pw === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: passwordMatch }
    );
  }

  get fullName() { return this.form.get('fullName')!; }
  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; }

  onSubmit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.error = '';

  const { fullName, email, password } = this.form.value;

  this.authService.register({
    FullName: fullName,
    Email: email,
    PasswordHash: password
  }).subscribe({
    next: (res: any) => {
      this.loading = false;

      // ✅ SUCCESS POPUP
      alert(res?.message || 'Registration successful!');

      // ✅ REDIRECT
      this.router.navigate(['/login']);
    },

    // error: (err) => {
    //   console.error('REGISTER ERROR:', err);

    //   // 🔥 HANDLE STRING RESPONSE (old backend case)
    //   if (typeof err.error === 'string') {
    //     if (err.error.includes('success')) {
    //       // 👉 backend actually succeeded
    //       alert('Registration successful!');
    //       this.router.navigate(['/login']);
    //       return;
    //     }
    //     this.error = err.error;
    //   } else {
    //     this.error =
    //       err.error?.message ||
    //       err.error?.title ||
    //       'Registration failed';
    //   }

    //   this.loading = false;
    // }
    error: (err) => {
  console.error('REGISTER ERROR:', err);

  // ✅ RATE LIMIT HANDLING
  if (err.status === 429) {
    this.error = 'Too many requests. Please try again later.';
    this.loading = false;
    return;
  }

  // ✅ HANDLE STRING RESPONSE (your backend case)
  if (typeof err.error === 'string') {

    // 🔥 IMPORTANT: backend returns success as string
    if (err.error.toLowerCase().includes('success')) {
      alert('Registration successful!');
      this.router.navigate(['/login']);
      return;
    }

    this.error = err.error;
  } else {
    this.error =
      err.error?.message ||
      err.error?.title ||
      'Registration failed';
  }

  this.loading = false;
}
  });
}
}