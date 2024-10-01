export interface Paciente {
  id?: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  sexo: 'M' | 'F';
  direccion: string;
  telefono: string;
  email: string;
  estado: 'Activo' | 'Inactivo';
  usuario_id: number;
  alergias: any[]; // Puedes definir una interfaz más específica para las alergias si es necesario
}