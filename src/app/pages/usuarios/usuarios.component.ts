import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/usuario';
import { UserService } from '../../services/usuarios/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Rol {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: User[] = [];
  usuarioSeleccionado: User = this.getUsuarioVacio();
  modalAbierto = false;
  roles: Rol[] = [
    { id: 1, nombre: 'Admin' },
    { id: 2, nombre: 'Doctor' },
    { id: 3, nombre: 'Paciente' }
  ];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.usuarios = data;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  crearUsuario() {
    this.usuarioSeleccionado = this.getUsuarioVacio();
    this.abrirModal();
  }

  guardarUsuario() {
    const operacion = this.usuarioSeleccionado.id === 0 
      ? this.userService.createUser(this.usuarioSeleccionado)
      : this.userService.updateUser(this.usuarioSeleccionado);

    operacion.subscribe(
      () => {
        this.obtenerUsuarios();
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al guardar usuario:', error);
      }
    );
  }

  editarUsuario(usuario: User) {
    this.usuarioSeleccionado = { ...usuario };
    this.abrirModal();
  }

  eliminarUsuario(usuario: User) {
    if (confirm(`¿Está seguro de que desea eliminar a ${usuario.usu_nombre}?`)) {
      this.userService.deleteUser(usuario.id).subscribe(
        () => {
          this.obtenerUsuarios();
        },
        (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      );
    }
  }

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.usuarioSeleccionado = this.getUsuarioVacio();
  }

  private getUsuarioVacio(): User {
    return {
      id: 0,
      rol_id: 0,
      usu_nombre: '',
      usu_estado: '',
      usu_pass: '',
      created_at: '',
      updated_at: ''
    };
  }

  getNombreRol(rolId: number): string {
    const rol = this.roles.find(r => r.id === rolId);
    return rol ? rol.nombre : 'Desconocido';
  }
}