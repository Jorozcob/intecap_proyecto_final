import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { AdminComponent } from './pages/admin/admin.component';
import { DoctoresComponent } from './pages/doctores/doctores.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { SalaComponent } from './pages/sala/sala.component';

// Importar más componentes aquí si es necesario

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige a /login como ruta predeterminada
  { path: 'login', component: LoginComponent },
  
  // Ruta para el Dashboard con rutas hijas
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'usuarios', component: UsuariosComponent },
      {path: 'admin', component: AdminComponent},
      {path: 'doctores', component: DoctoresComponent},
      {path: 'pacientes', component: PacientesComponent},
      {path: 'salas', component: SalaComponent},
      // Añade más rutas aquí, como:
      // { path: 'customers', component: CustomersComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Redirige al componente predeterminado dentro del dashboard
    ]
  },

  { path: '**', redirectTo: '/login' } // Ruta de fallback en caso de que no se encuentre la ruta
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
