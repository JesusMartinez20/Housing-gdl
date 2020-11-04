import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  usuarioFB: SocialUser = null;
  loggedIn:boolean = false;
  mensaje = null;
  datospago = null;
  id_usuario = null;

  formRegistro:FormGroup;

  @ViewChild('cerrar',{ static: false }) cerrar;
  @ViewChild('modalRegistro',{ static: false }) modalRegistro;
  @ViewChild('cerrarModalRegistro',{ static: false }) cerrarModalRegistro;
  @ViewChild('modalPago',{ static: false }) modalPago;
  @ViewChild('cerrarModalPago',{ static: false }) cerrarModalPago;
  @ViewChild('modalBloqueo',{ static: false }) modalBloqueo;
  @ViewChild('cerrarModalBloqueo',{ static: false }) cerrarModalBloqueo;

  constructor(public router:Router,
              private authService:SocialAuthService,
              private usuariosService:UsuariosService,
              private fb:FormBuilder
              ) { }

  ngOnInit() {
    this.formRegistroInit();

    console.log(this.loggedIn);
    console.log( JSON.parse(localStorage.getItem("usuario")));

    if(JSON.parse(localStorage.getItem("usuario")) !== null) {
      console.log("ola");
      this.usuarioFB = JSON.parse(localStorage.getItem("usuario"));
      this.loggedIn = true;
      this.usuariosService.setEstadoSesion(true);
      console.log(this.usuarioFB);
    }

    this.authService.authState.subscribe((user) => {
      if (this.usuarioFB === null ) {
        this.usuarioFB = user;
        this.loggedIn = (this.usuarioFB != null);
        localStorage.setItem("usuario", JSON.stringify(this.usuarioFB));
      }
      if(this.loggedIn){
        this.usuariosService.registrarUsuario(this.usuarioFB).subscribe( datos => {
          if(datos['resultado'] == "ERROR"){
            console.log("ERROR");
            return
          }
          else if( datos['resultado'] == "OK")
          {

            let usuario = JSON.parse(localStorage.getItem("usuario"));
            usuario["id_usuario"] = datos["id_usuario"];
            localStorage.setItem("usuario", JSON.stringify(usuario));
            this.id_usuario = usuario["id_usuario"];
            let tipo = datos["estado"];
            console.log(tipo);
            this.cerrar.nativeElement.click();
            if(tipo == 2){
              this.usuariosService.consultaNotificacionBloqueo(datos["id_usuario"]).subscribe( resultado => {
                this.mensaje = resultado['mensaje'];
                window.confirm(resultado['mensaje']);
              });

              this.logOut();
              //this.modalBloqueo.nativeElement.click();
            }else{

              if(tipo == 0){
                this.modalRegistro.nativeElement.click();
              }else if(tipo == 1){
                this.usuariosService.setEstadoSesion(true);
                this.usuariosService.consultaNotificacion(usuario["id_usuario"]).subscribe( chats => {
                  let chat = chats["chat"];
                  if(chat == -1){
                    return
                  }else{
                    this.router.navigate(['chat', chat])
                  }
                });
              }else{
                this.usuariosService.setEstadoSesion(true);
                this.usuariosService.datosPago(usuario["id_usuario"]).subscribe( pago => {
                  this.datospago = pago;
                });

              }

              (this.loggedIn) ? this.usuariosService.setEstadoSesion(true) : this.usuariosService.setEstadoSesion(false);
              this.formRegistro.addControl('id', this.fb.control(null));
              this.formRegistro.get('id').setValue(this.usuarioFB.id);

            }
            }
        });
      }
    });
  }

  formRegistroInit(){
    this.formRegistro = this.fb.group({
      correo:[null, [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.required]],
      celular:[null, Validators.required],
      celularExt:[null, Validators.required],
      nacimiento:[null, Validators.required]
    })
  }

  get validacionCorreoR(){
    return this.formRegistro.get('correo').invalid && this.formRegistro.get('correo').touched
  }

  get validacionNacimiento(){
    return this.formRegistro.get('nacimiento').invalid && this.formRegistro.get('nacimiento').touched
  }

  get validacionTelefono(){
    return this.formRegistro.get('celular').invalid && this.formRegistro.get('celular').touched
  }

  get validacionTelefonoExtra(){
    return this.formRegistro.get('celularExt').invalid && this.formRegistro.get('celularExt').touched
  }

  get validacionNumero(){
    return this.esAlfa(this.formRegistro.get('celular').value) && this.formRegistro.get('celular').value != ""
  }

  get validacionNumeroExtra(){
    return this.esAlfa(this.formRegistro.get('celularExt').value) && this.formRegistro.get('celularExt').value != ""
  }

  esAlfa(str) {
    if(str != null){
      if (!str.match(/^[0-9]+$/)){
        return true
      }
      else{
        return false
      }
    }
  }

  verPerfil(){
    this.router.navigate(['perfil'])
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  logOut(): void {
    this.authService.signOut();
    localStorage.removeItem("usuario");
    localStorage.removeItem("usuario");
    this.usuariosService.setEstadoSesion(false);
    this.loggedIn = false;
    this.usuarioFB = null;
    console.log(this.loggedIn);
    console.log(localStorage.getItem("usuario"));
    this.router.navigate(['inicio']);
  }

  guardarRegistro(){
    console.log(this.formRegistro.value);

    this.usuariosService.buscarCorreo(this.formRegistro.get('correo').value).subscribe(datos => {
      if(datos['estado'] == 0){
        window.confirm(datos['mensaje']);
        return
      }
      else if(datos['estado'] == 1){
        this.usuariosService.terminarRegistro(this.formRegistro.value, this.id_usuario).subscribe( datos => {
          if(datos['resultado'] == "ERROR"){
            window.confirm("Ocurrio un error. Inténtelo más tarde.");
            return
          }
          else if(datos['resultado'] == "OK"){
            window.confirm("Registro completado con éxito.");
            this.usuariosService.setEstadoSesion(true);
            this.formRegistro.reset();
            this.cerrarModalRegistro.nativeElement.click();
          }
        })
      }
    });
  }
  realizarPago(){
    console.log(this.datospago.value);
  }

  verChats(){
    // this.router.navigate(['']).
  }

}
