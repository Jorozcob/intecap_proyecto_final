import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';

interface UserData {
  rol_id: number;
  nombre: string;
  apellido: string;
  email: string;
  // Añade aquí otras propiedades del usuario según tu interfaz
  [key: string]: any; // Para permitir propiedades adicionales
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterOutlet, NgClass, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isSidebarCollapsed = false;
  userData: UserData | null = null;
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const userDataString = sessionStorage.getItem('userData');
    if (userDataString) {
      try {
        this.userData = JSON.parse(userDataString);
        console.log('Datos del usuario recuperados:', this.userData);
        this.checkUserRole();
      } catch (error) {
        console.error('Error al parsear los datos del usuario:', error);
        this.handleInvalidSession();
      }
    } else {
      console.warn('No se encontraron datos del usuario en sessionStorage');
      this.handleInvalidSession();
    }
  }

  checkUserRole(): void {
    if (this.userData && this.userData.rol_id) {
      // Aquí puedes implementar lógica basada en roles
      switch(this.userData.rol_id) {
        case 1: // Administrador
          console.log('Usuario es Administrador');
          break;
        case 2: // Otro rol
          console.log('Usuario tiene otro rol');
          break;
        default:
          console.warn('Rol de usuario no reconocido');
          // Podrías redirigir a una página de acceso denegado
          // this.router.navigate(['/acceso-denegado']);
      }
    }
  }

  handleInvalidSession(): void {
    // Limpiar cualquier dato de sesión que pueda existir
    sessionStorage.clear();
    // Redirigir al login
    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    sessionStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }

  // Métodos de utilidad para acceder a datos del usuario
  getUserFullName(): string {
    return this.userData ? `${this.userData.nombre} ${this.userData.apellido}` : 'Usuario';
  }

  getUserEmail(): string {
    return this.userData?.email || 'No disponible';
  }

  hasRole(roleId: number): boolean {
    return this.userData?.rol_id === roleId;
  }
}