import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sala } from '../../interfaces/sala';
import { SalaService } from '../../services/salas/sala.service';


@Component({
  selector: 'app-sala',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sala.component.html',
  styleUrls: ['./sala.component.css']
})
export class SalaComponent implements OnInit {
  salas: Sala[] = [];
  selectedSala: Sala | null = null;
  isModalOpen = false;

  constructor(private salaService: SalaService) {}

  ngOnInit() {
    this.loadSalas();
  }

  loadSalas() {
    this.salaService.getData().subscribe({
      next: (data) => {
        this.salas = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching salas:', error);
        this.showError('Error al cargar las salas');
      }
    });
  }

  openModal(sala?: Sala) {
    this.selectedSala = sala ? { ...sala } : {
      id: 0,
      sal_nombre: '',
      sal_descripcion: '',
      sal_estado: '',
      created_at: '',
      updated_at: ''
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedSala = null;
  }

  saveSala() {
    if (this.selectedSala && this.isValidSala(this.selectedSala)) {
      if (this.selectedSala.id) {
        this.updateSala(this.selectedSala);
      } else {
        this.createSala(this.selectedSala);
      }
      this.closeModal();
    } else {
      this.showError('Por favor, complete todos los campos requeridos');
    }
  }

  isValidSala(sala: Sala): boolean {
    return !!(sala.sal_nombre && sala.sal_descripcion && sala.sal_estado);
  }

  createSala(sala: Sala) {
    this.salaService.createData(sala).subscribe({
      next: (createdSala) => {
        this.salas.push(createdSala);
        this.showSuccess('Sala creada exitosamente');
        this.loadSalas(); // Recargar la lista para asegurar datos actualizados
      },
      error: (error) => {
        console.error('Error creating sala:', error);
        this.showError('Error al crear la sala');
      }
    });
  }

  updateSala(sala: Sala) {
    this.salaService.updateData(sala).subscribe({
      next: (updatedSala) => {
        const index = this.salas.findIndex(s => s.id === updatedSala.id);
        if (index !== -1) {
          this.salas[index] = updatedSala;
        }
        this.showSuccess('Sala actualizada exitosamente');
        this.loadSalas(); // Recargar la lista para asegurar datos actualizados
      },
      error: (error) => {
        console.error('Error updating sala:', error);
        this.showError('Error al actualizar la sala');
      }
    });
  }

  deleteSala(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta sala?')) {
      this.salaService.deleteData(id).subscribe({
        next: () => {
          this.salas = this.salas.filter(sala => sala.id !== id);
          this.showSuccess('Sala eliminada exitosamente');
        },
        error: (error) => {
          console.error('Error deleting sala:', error);
          this.showError('Error al eliminar la sala');
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