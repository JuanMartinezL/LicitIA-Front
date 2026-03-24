import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  tabIndex = 0;
  cargando = false;
  error = '';
  mostrarPassword = false;

  loginForm: FormGroup;
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registroForm = this.fb.group({
      nombre:   ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      empresa:  ['', Validators.required],
      nit:      ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

   onLogin() {
    if (this.loginForm.invalid) return;
    this.cargando = true;
    this.error = '';

    const { email, password } = this.loginForm.value;
    this.authService.login(email!, password!).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err: any) => {
        setTimeout(() => {
          this.error = err.error?.error || 'Error al iniciar sesión';
          this.cargando = false;
        });
      },
    });
  }

  onRegistro() {
    if (this.registroForm.invalid) return;
    this.cargando = true;
    this.error = '';

    this.authService.registro(this.registroForm.value as any).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err: any) => {
        setTimeout(() => {
          this.error = err.error?.error || 'Error al crear la cuenta';
          this.cargando = false;
        });
      },
    });
  }
}