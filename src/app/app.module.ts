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
import { CasasComponent } from './components/casas/casas.component';
import { PublicacionesComponent } from './components/publicaciones/publicaciones.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { CasaViewComponent } from './components/casa-view/casa-view.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PublicacionViewComponent } from './components/publicacion-view/publicacion-view.component';
import { HistorialComprasComponent } from './components/historial-compras/historial-compras.component';
import { CompraInfoComponent } from './components/compra-info/compra-info.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { CasasService } from './services/casas.service';
import { PublicacionesService } from './services/publicaciones.service';
import { CuartosService } from './services/cuartos.service';
import { UsuariosService } from './services/usuarios.service';
import { VentasService } from './services/ventas.service';
import { PerfilEditarComponent } from './components/perfil-editar/perfil-editar.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ChatComponent } from './components/chat/chat.component';
import { CuartoComponent } from './components/cuarto/cuarto.component';
import { ModalChatComponent } from './components/modal-chat/modal-chat.component';
import { MDBBootstrapModulesPro, MDBSpinningPreloader } from 'ng-uikit-pro-standard';
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    InicioComponent,
    CasasComponent,
    PublicacionesComponent,
    GaleriaComponent,
    NosotrosComponent,
    CasaViewComponent,
    PerfilComponent,
    PublicacionViewComponent,
    HistorialComprasComponent,
    CompraInfoComponent,
    PerfilEditarComponent,
    ChatListComponent,
    ChatComponent,
    CuartoComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CarouselModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SocialLoginModule,
    MDBBootstrapModulesPro.forRoot(),
    NgxStripeModule.forRoot('pk_test_51Hm9bxKNYck6nCphXGKQ2mKlVR0cSjZHOyvkv1h5XHetruiwFIicuGYYl1cfW49h4149JMAux2X6KPBYQFQEStwb000Ox1hMcu\n'),
  ],
  entryComponents: [ ModalChatComponent ],
  providers: [
    MDBSpinningPreloader,
    CasasService,
    PublicacionesService,
    CuartosService,
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
            provider: new FacebookLoginProvider('411727070232371'),
          },
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
