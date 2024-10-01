import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Admin } from '../../interfaces/admin';
import { AdminService } from '../../services/admin/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  admins: Admin[] = [];
  selectedAdmin: Admin | null = null;
  isModalOpen = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadAdmins();
  }

  loadAdmins() {
    this.adminService.getAdmins().subscribe({
      next: (data) => {
        this.admins = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching admins:', error);
        this.showError('Error al cargar los administradores');
      }
    });
  }

  openModal(admin?: Admin) {
    this.selectedAdmin = admin ? { ...admin } : {
      id: 0,
      adm_nombre: '',
      adm_apellido: '',
      adm_cargo: '',
      adm_telefono: '',
      adm_email: '',
      usuario_id: 0,
      created_at: '',
      updated_at: ''
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedAdmin = null;
  }

  saveAdmin() {
    if (this.selectedAdmin && this.isValidAdmin(this.selectedAdmin)) {
      if (this.selectedAdmin.id) {
        this.updateAdmin(this.selectedAdmin);
      } else {
        this.createAdmin(this.selectedAdmin);
      }
      this.closeModal();
    } else {
      this.showError('Por favor, complete todos los campos requeridos');
    }
  }

  isValidAdmin(admin: Admin): boolean {
    return !!(admin.adm_nombre && admin.adm_apellido && admin.adm_cargo &&
              admin.adm_telefono && admin.adm_email);
  }

  createAdmin(admin: Admin) {
    this.adminService.createAdmin(admin).subscribe({
      next: (createdAdmin) => {
        this.admins.push(createdAdmin);
        this.showSuccess('Administrador creado exitosamente');
        this.loadAdmins(); // Recargar la lista para asegurar datos actualizados
      },
      error: (error) => {
        console.error('Error creating admin:', error);
        this.showError('Error al crear el administrador');
      }
    });
  }

  updateAdmin(admin: Admin) {
    this.adminService.updateAdmin(admin).subscribe({
      next: (updatedAdmin) => {
        const index = this.admins.findIndex(a => a.id === updatedAdmin.id);
        if (index !== -1) {
          this.admins[index] = updatedAdmin;
        }
        this.showSuccess('Administrador actualizado exitosamente');
        this.loadAdmins(); // Recargar la lista para asegurar datos actualizados
      },
      error: (error) => {
        console.error('Error updating admin:', error);
        this.showError('Error al actualizar el administrador');
      }
    });
  }

  deleteAdmin(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este administrador?')) {
      this.adminService.deleteAdmin(id).subscribe({
        next: () => {
          this.admins = this.admins.filter(admin => admin.id !== id);
          this.showSuccess('Administrador eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error deleting admin:', error);
          this.showError('Error al eliminar el administrador');
        }
      });
    }
  }

  showError(message: string) {
    // Implementar notificación de error (puedes usar un componente de alerta de Bootstrap)
    console.error(message);
    // Ejemplo: this.toastr.error(message);
  }

  showSuccess(message: string) {
    // Implementar notificación de éxito (puedes usar un componente de alerta de Bootstrap)
    console.log(message);
    // Ejemplo: this.toastr.success(message);
  }
}