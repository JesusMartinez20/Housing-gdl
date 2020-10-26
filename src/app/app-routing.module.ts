import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { PublicacionesComponent } from './components/publicaciones/publicaciones.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { EventoViewComponent } from './components/evento-view/evento-view.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PublicacionViewComponent } from './components/publicacion-view/publicacion-view.component';
import { HistorialComprasComponent } from './components/historial-compras/historial-compras.component';
import { CompraInfoComponent } from './components/compra-info/compra-info.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { CompraComponent } from './components/compra/compra.component';
import { PagoComponent } from './components/pago/pago.component';
import { PerfilEditarComponent } from './components/perfil-editar/perfil-editar.component';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'publicaciones', component: PublicacionesComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'evento/:id', component: EventoViewComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'editar-perfil', component: PerfilEditarComponent },
  { path: 'publicacion/:id', component: PublicacionViewComponent },
  { path: 'historial', component: HistorialComprasComponent },
  { path: 'info-compra/:id', component: CompraInfoComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'compra', component: CompraComponent },
  { path: 'pago', component: PagoComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
