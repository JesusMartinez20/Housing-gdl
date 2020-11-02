import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { CasasComponent } from './components/casas/casas.component';
import { PublicacionesComponent } from './components/publicaciones/publicaciones.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { CasaViewComponent } from './components/casa-view/casa-view.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PublicacionViewComponent } from './components/publicacion-view/publicacion-view.component';
import { HistorialComprasComponent } from './components/historial-compras/historial-compras.component';
import { CompraInfoComponent } from './components/compra-info/compra-info.component';
import { PerfilEditarComponent } from './components/perfil-editar/perfil-editar.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ChatComponent } from './components/chat/chat.component';
import { CuartoComponent } from './components/cuarto/cuarto.component';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'casas', component: CasasComponent },
  { path: 'publicaciones', component: PublicacionesComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'casa/:id', component: CasaViewComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'editar-perfil', component: PerfilEditarComponent },
  { path: 'publicacion/:id', component: PublicacionViewComponent },
  { path: 'historial', component: HistorialComprasComponent },
  { path: 'info-compra/:id', component: CompraInfoComponent },
  { path: 'chat-list', component: ChatListComponent },
  { path: 'chat:id', component: ChatComponent },
  { path: 'cuarto/:id', component: CuartoComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
