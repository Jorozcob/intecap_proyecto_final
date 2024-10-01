import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Doctor } from '../../interfaces/doctor';
import { DoctorService } from '../../services/doctores/doctor.service';

@Component({
  selector: 'app-doctores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctores.component.html',
  styleUrls: ['./doctores.component.css']
})
export class DoctoresComponent implements OnInit {
  doctores: Doctor[] = [];
  doctorSeleccionado: Doctor | null = null;
  modalAbierto = false;

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.cargarDoctores();
  }

  cargarDoctores() {
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctores = data;
        console.log('Doctores cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar doctores:', error);
        this.mostrarError('Error al cargar los doctores');
      }
    });
  }

  abrirModal(doctor?: Doctor) {
    this.doctorSeleccionado = doctor ? { ...doctor } : {
      id: 0,
      med_nombre: '',
      med_apellido: '',
      med_telefono: '',
      med_email: '',
      med_estado: 'activo',
      usuario_id: 0,
      created_at: '',
      updated_at: ''
    };
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.doctorSeleccionado = null;
  }

  guardarDoctor() {
    if (this.doctorSeleccionado && this.esDoctorValido(this.doctorSeleccionado)) {
      if (this.doctorSeleccionado.id) {
        this.actualizarDoctor(this.doctorSeleccionado);
      } else {
        this.crearDoctor(this.doctorSeleccionado);
      }
      this.cerrarModal();
    } else {
      this.mostrarError('Por favor, complete todos los campos requeridos');
    }
  }

  esDoctorValido(doctor: Doctor): boolean {
    return !!(doctor.med_nombre && doctor.med_apellido && doctor.med_telefono &&
              doctor.med_email && doctor.med_estado);
  }

  crearDoctor(doctor: Doctor) {
    this.doctorService.createDoctor(doctor).subscribe({
      next: (doctorCreado) => {
        this.doctores.push(doctorCreado);
        this.mostrarExito('Doctor creado exitosamente');
        this.cargarDoctores(); // Recargar la lista para asegurar datos actualizados
      },
      error: (error) => {
        console.error('Error al crear doctor:', error);
        this.mostrarError('Error al crear el doctor');
      }
    });
  }

  actualizarDoctor(doctor: Doctor) {
    this.doctorService.updateDoctor(doctor).subscribe({
      next: (doctorActualizado) => {
        const index = this.doctores.findIndex(d => d.id === doctorActualizado.id);
        if (index !== -1) {
          this.doctores[index] = doctorActualizado;
        }
        this.mostrarExito('Doctor actualizado exitosamente');
        this.cargarDoctores(); // Recargar la lista para asegurar datos actualizados
      },
      error: (error) => {
        console.error('Error al actualizar doctor:', error);
        this.mostrarError('Error al actualizar el doctor');
      }
    });
  }

  eliminarDoctor(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este doctor?')) {
      this.doctorService.deleteDoctor(id).subscribe({
        next: () => {
          this.doctores = this.doctores.filter(doctor => doctor.id !== id);
          this.mostrarExito('Doctor eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar doctor:', error);
          this.mostrarError('Error al eliminar el doctor');
        }
      });
    }
  }

  mostrarError(mensaje: string) {
    // Implementar notificación de error (puedes usar un componente de alerta de Bootstrap)
    console.error(mensaje);
    // Ejemplo: this.toastr.error(mensaje);
  }

  mostrarExito(mensaje: string) {
    // Implementar notificación de éxito (puedes usar un componente de alerta de Bootstrap)
    console.log(mensaje);
    // Ejemplo: this.toastr.success(mensaje);
  }
}