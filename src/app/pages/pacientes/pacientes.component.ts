import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Paciente } from '../../interfaces/paciente';
import { PacienteService } from '../../services/pacientes/paciente.service';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente | null = null;
  modalAbierto = false;

  constructor(private pacienteService: PacienteService) {}

  ngOnInit() {
    this.cargarPacientes();
  }

  cargarPacientes() {
    this.pacienteService.getPacientes().subscribe({
      next: (data) => {
        this.pacientes = data;
        console.log('Pacientes cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
        this.mostrarError('Error al cargar los pacientes');
      }
    });
  }

  abrirModal(paciente?: Paciente) {
    this.pacienteSeleccionado = paciente ? { ...paciente } : {
      nombre: '',
      apellido: '',
      fecha_nacimiento: '',
      sexo: 'M',
      direccion: '',
      telefono: '',
      email: '',
      estado: 'Activo',
      usuario_id: 0,
      alergias: []
    };
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.pacienteSeleccionado = null;
  }

  guardarPaciente() {
    if (this.pacienteSeleccionado && this.esPacienteValido(this.pacienteSeleccionado)) {
      if (this.pacienteSeleccionado.id) {
        this.actualizarPaciente(this.pacienteSeleccionado);
      } else {
        this.crearPaciente(this.pacienteSeleccionado);
      }
      this.cerrarModal();
    } else {
      this.mostrarError('Por favor, complete todos los campos requeridos correctamente');
    }
  }

  esPacienteValido(paciente: Paciente): boolean {
    return !!(paciente.nombre && paciente.apellido && paciente.fecha_nacimiento &&
              paciente.sexo && paciente.direccion && paciente.telefono &&
              paciente.email && paciente.estado && paciente.usuario_id);
  }

  crearPaciente(paciente: Paciente) {
    this.pacienteService.createPaciente(paciente).subscribe({
      next: (pacienteCreado) => {
        this.pacientes.push(pacienteCreado);
        this.mostrarExito('Paciente creado exitosamente');
        this.cargarPacientes(); // Recargar la lista para asegurar datos actualizados
      },
      error: (error) => {
        console.error('Error al crear paciente:', error);
        this.mostrarError('Error al crear el paciente');
      }
    });
  }

  actualizarPaciente(paciente: Paciente) {
    this.pacienteService.updatePaciente(paciente).subscribe({
      next: (pacienteActualizado) => {
        const index = this.pacientes.findIndex(p => p.id === pacienteActualizado.id);
        if (index !== -1) {
          this.pacientes[index] = pacienteActualizado;
        }
        this.mostrarExito('Paciente actualizado exitosamente');
        this.cargarPacientes(); // Recargar la lista para asegurar datos actualizados
      },
      error: (error) => {
        console.error('Error al actualizar paciente:', error);
        this.mostrarError('Error al actualizar el paciente');
      }
    });
  }

  eliminarPaciente(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este paciente?')) {
      this.pacienteService.deletePaciente(id).subscribe({
        next: () => {
          this.pacientes = this.pacientes.filter(paciente => paciente.id !== id);
          this.mostrarExito('Paciente eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar paciente:', error);
          this.mostrarError('Error al eliminar el paciente');
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