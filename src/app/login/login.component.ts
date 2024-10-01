import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      this.authService.login(username, password).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          if (response && response.user) {
            // Guardar todos los datos del usuario en sessionStorage
            sessionStorage.setItem('userData', JSON.stringify(response.user));
            console.log('Datos del usuario guardados en sessionStorage');
            
            // Navegar al dashboard
            this.router.navigate(['/dashboard']);
          } else {
            console.error('La respuesta del servidor no contiene los datos del usuario esperados');
            this.loginError = 'Error en la respuesta del servidor. Por favor, intente nuevamente.';
          }
        },
        error: (error) => {
          console.error('Login fallido:', error);
          this.loginError = 'Las credenciales son inválidas. Por favor, verifica tu nombre de usuario y contraseña.';
        }
      });
    }
  }
}