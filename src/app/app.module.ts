import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HttpClientModule } from '@angular/common/http';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { FacebookLoginProvider} from 'angularx-social-login';


import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
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
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CarritoComponent } from './components/carrito/carrito.component';
import { CompraComponent } from './components/compra/compra.component';

import { EventosService } from './services/eventos.service';
import { PublicacionesService } from './services/publicaciones.service';
import { BoletosService } from './services/boletos.service';
import { UsuariosService } from './services/usuarios.service';
import { PagoComponent } from './components/pago/pago.component';
import { VentasService } from './services/ventas.service';
import { PerfilEditarComponent } from './components/perfil-editar/perfil-editar.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    InicioComponent,
    EventosComponent,
    PublicacionesComponent,
    GaleriaComponent,
    NosotrosComponent,
    EventoViewComponent,
    PerfilComponent,
    PublicacionViewComponent,
    HistorialComprasComponent,
    CompraInfoComponent,
    CarritoComponent,
    CompraComponent,
    PagoComponent,
    PerfilEditarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CarouselModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SocialLoginModule
  ],
  providers: [
    EventosService,
    PublicacionesService,
    BoletosService,
    UsuariosService,
    VentasService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('691078078359422'),
          },
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
