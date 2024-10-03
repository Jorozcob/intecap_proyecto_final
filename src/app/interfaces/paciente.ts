/* export interface Paciente {
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
} */

  // Interfaz principal para el paciente
export interface Paciente {
  id: number;
  pac_nombre: string;
  pac_apellido: string;
  pac_fecha_nacimiento: string; // Consideramos usar Date si necesitamos manipular la fecha
  pac_sexo: string;
  pac_direccion: string;
  pac_telefono: string;
  pac_email: string;
  pac_estado: string;
  usuario_id: number;
  created_at: string; // Consideramos usar Date si necesitamos manipular la fecha
  updated_at: string; // Consideramos usar Date si necesitamos manipular la fecha
  alergias: string[];
}