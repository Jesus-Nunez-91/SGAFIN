import { Routes } from '@angular/router';
import { ComponenteInicioSesion } from './pages/inicio-sesion.componente';
import { ComponenteBienvenida } from './pages/bienvenida.componente';
import { ComponentePanelPrincipal } from './pages/panel-principal.componente';
import { ComponenteLaboratorios } from './pages/laboratorios.componente';
import { ComponenteHorarioAcademico } from './pages/horario-academico.componente';
import { ComponenteUsuarios } from './pages/usuarios.componente';
import { ComponenteInventario } from './pages/inventario.componente';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio-sesion', pathMatch: 'full' },
  { path: 'inicio-sesion', component: ComponenteInicioSesion },
  { path: 'bienvenida', component: ComponenteBienvenida },
  { path: 'panel-principal', component: ComponentePanelPrincipal },
  { path: 'laboratorios', component: ComponenteLaboratorios },
  { path: 'inventario/:area/:lab', component: ComponenteInventario },
  { path: 'horario-academico', component: ComponenteHorarioAcademico },
  { path: 'usuarios', component: ComponenteUsuarios },
  { path: '**', redirectTo: 'inicio-sesion' }
];
