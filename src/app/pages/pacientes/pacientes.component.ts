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
  cargando = false;

  constructor(private pacienteService: PacienteService) {}

  ngOnInit() {
    this.cargarPacientes();
  }

  cargarPacientes() {
    this.cargando = true;
    this.pacienteService.getPacientes().subscribe({
      next: (data) => {
        this.pacientes = data;
        this.cargando = false;
        console.log('Pacientes cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
        this.mostrarError('Error al cargar los pacientes');
        this.cargando = false;
      }
    });
  }

  abrirModal(paciente?: Paciente) {
    this.pacienteSeleccionado = paciente ? { ...paciente } : {
      id: 0,
      pac_nombre: '',
      pac_apellido: '',
      pac_fecha_nacimiento: '',
      pac_sexo: 'M',
      pac_direccion: '',
      pac_telefono: '',
      pac_email: '',
      pac_estado: 'Activo',
      usuario_id: 0,
      created_at: '',
      updated_at: '',
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
      this.cargando = true;
      if (this.pacienteSeleccionado.id) {
        this.actualizarPaciente(this.pacienteSeleccionado);
      } else {
        this.crearPaciente(this.pacienteSeleccionado);
      }
    } else {
      this.mostrarError('Por favor, complete todos los campos requeridos correctamente');
    }
  }

  esPacienteValido(paciente: Paciente): boolean {
    return !!(paciente.pac_nombre && paciente.pac_apellido && paciente.pac_fecha_nacimiento &&
              paciente.pac_sexo && paciente.pac_direccion && paciente.pac_telefono &&
              paciente.pac_email && paciente.pac_estado && paciente.usuario_id);
  }

  crearPaciente(paciente: Paciente) {
    this.pacienteService.createPaciente(paciente).subscribe({
      next: (pacienteCreado) => {
        this.pacientes.push(pacienteCreado);
        this.mostrarExito('Paciente creado exitosamente');
        this.cargarPacientes();
        this.cerrarModal();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al crear paciente:', error);
        this.mostrarError('Error al crear el paciente');
        this.cargando = false;
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
        this.cargarPacientes();
        this.cerrarModal();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al actualizar paciente:', error);
        this.mostrarError('Error al actualizar el paciente');
        this.cargando = false;
      }
    });
  }

  eliminarPaciente(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este paciente?')) {
      this.cargando = true;
      this.pacienteService.deletePaciente(id).subscribe({
        next: () => {
          this.pacientes = this.pacientes.filter(paciente => paciente.id !== id);
          this.mostrarExito('Paciente eliminado exitosamente');
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al eliminar paciente:', error);
          this.mostrarError('Error al eliminar el paciente');
          this.cargando = false;
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