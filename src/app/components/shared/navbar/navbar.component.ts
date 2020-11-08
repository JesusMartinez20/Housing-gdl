import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SocialAuthService} from "angularx-social-login";
import {FacebookLoginProvider} from "angularx-social-login";
import {SocialUser} from "angularx-social-login";
import {UsuariosService} from '../../../services/usuarios.service';
import { ChatService } from '../../../services/chat.service';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import {RedirectToCheckoutOptions, RedirectToCheckoutServerOptions} from "@stripe/stripe-js";
import {HttpClient} from "@angular/common/http";



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  stripeTest: FormGroup;

  usuarioFB: SocialUser = null;
  loggedIn: boolean = false;
  mensaje = null;
  datospago:any = {
    fk_oferta: "",
    id_compra: "",
    nombre_casa: "",
    nombre_cuarto: "",
    nombre_semestre: "",
    precio: "",
  };
  id_usuario:number = null;
  id_compra = 2;
  id_chat:number = null;
  enviarForm: FormGroup;

  showCreditcard=false;

  formRegistro: FormGroup;
  
  pagando=false;

  @ViewChild('cerrar', {static: false}) cerrar;
  @ViewChild('modalRegistro', {static: false}) modalRegistro;
  @ViewChild('cerrarModalRegistro', {static: false}) cerrarModalRegistro;
  @ViewChild('cerrarModalPago', {static: false}) cerrarModalPago;
  @ViewChild('modalBloqueo', {static: false}) modalBloqueo;
  @ViewChild('cerrarModalBloqueo', {static: false}) cerrarModalBloqueo;
  @ViewChild('modalPago1', {static: false}) modalPago1;
  @ViewChild('cerrarPagar', {static: false}) cerrarPagar;
  @ViewChild('modalChat1', {static: false}) modalChat1;
  @ViewChild('cerrarModalChat1', {static: false}) cerrarModalChat1;

  constructor(public router: Router,
              private authService: SocialAuthService,
              private usuariosService: UsuariosService,
              private fb: FormBuilder,
              private stripeService: StripeService,
              private http: HttpClient,
              private chatService:ChatService
  ) {
  }

  formEnviarInit(){
    this.enviarForm = this.fb.group({
      enviarInput:[],
    })
  }

  ngOnInit() {
    this.formEnviarInit();
    this.formRegistroInit();
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });

    console.log(this.loggedIn);
    console.log(JSON.parse(localStorage.getItem("usuario")));

    if (JSON.parse(localStorage.getItem("usuario")) !== null) {
      console.log("ola");
      this.usuarioFB = JSON.parse(localStorage.getItem("usuario"));
      this.loggedIn = true;
      this.usuariosService.setEstadoSesion(true);
      console.log(this.usuarioFB);
    }

    this.authService.authState.subscribe((user) => {
      if (this.usuarioFB === null) {
        this.usuarioFB = user;
        this.loggedIn = (this.usuarioFB != null);
        localStorage.setItem("usuario", JSON.stringify(this.usuarioFB));
      }
      if (this.loggedIn) {
        this.usuariosService.registrarUsuario(this.usuarioFB).subscribe(datos => {
          if (datos['resultado'] == "ERROR") {
            console.log("ERROR");
            return
          } else if (datos['resultado'] == "OK") {

            let usuario = JSON.parse(localStorage.getItem("usuario"));
            usuario["id_usuario"] = datos["id_usuario"];
            localStorage.setItem("usuario", JSON.stringify(usuario));
            this.id_usuario = usuario["id_usuario"];
            let tipo = datos["estado"];
            console.log(this.id_usuario);
            localStorage.setItem("id_usuario", this.id_usuario.toString());
            this.cerrar.nativeElement.click();
            this.chatService.comprobarChat(usuario["id_usuario"]).subscribe(resultado => {
              this.id_chat = resultado["id_chat"];
              console.log(this.id_chat)
            });
            if (tipo == 2) {
              this.usuariosService.consultaNotificacionBloqueo(datos["id_usuario"]).subscribe(resultado => {
                this.mensaje = resultado['mensaje'];
                window.confirm(resultado['mensaje']);
              });

              this.logOut();
              //this.modalBloqueo.nativeElement.click();
            } else {

              if (tipo == 0) {
                this.modalRegistro.nativeElement.click();
              } else if (tipo == 1) {
                this.usuariosService.setEstadoSesion(true);
                this.usuariosService.consultaNotificacion(usuario["id_usuario"]).subscribe(chats => {
                  let chat = chats["chat"];
                  if (chat == -1) {
                    return
                  } else {
                    this.router.navigate(['chat', chat])
                  }
                });
              } else {
                this.usuariosService.setEstadoSesion(true);
                this.usuariosService.datosPago(usuario["id_usuario"]).subscribe(pago => {
                  this.datospago = pago;
                  console.log(this.datospago);
                  console.log('ptm')
                  this.modalPago1.nativeElement.click();

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
    this.chatService.comprobarChat(parseInt(localStorage.getItem('id_usuario'))).subscribe(resultado => {
      this.id_chat = resultado["id_chat"];
      console.log(this.id_chat)
    });
  }

  formRegistroInit() {
    this.formRegistro = this.fb.group({
      correo: [null, [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.required]],
      celular: [null, Validators.required],
      celularExt: [null, Validators.required],
      nacimiento: [null, Validators.required],
      nacionalidad: [null, Validators.required],
    })
  }

  get validacionCorreoR() {
    return this.formRegistro.get('correo').invalid && this.formRegistro.get('correo').touched
  }

  get validacionNacimiento() {
    return this.formRegistro.get('nacimiento').invalid && this.formRegistro.get('nacimiento').touched
  }

  get validacionTelefono() {
    return this.formRegistro.get('celular').invalid && this.formRegistro.get('celular').touched
  }

  get validacionTelefonoExtra() {
    return this.formRegistro.get('celularExt').invalid && this.formRegistro.get('celularExt').touched
  }

  get validacionNumero() {
    return this.esAlfa(this.formRegistro.get('celular').value) && this.formRegistro.get('celular').value != ""
  }

  get validacionNumeroExtra() {
    return this.esAlfa(this.formRegistro.get('celularExt').value) && this.formRegistro.get('celularExt').value != ""
  }

  esAlfa(str) {
    if (str != null) {
      if (!str.match(/^[0-9]+$/)) {
        return true
      } else {
        return false
      }
    }
  }

  verPerfil() {
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

  guardarRegistro() {
    console.log(this.formRegistro.value);

    this.usuariosService.buscarCorreo(this.formRegistro.get('correo').value).subscribe(datos => {
      if (datos['estado'] == 0) {
        window.confirm(datos['mensaje']);
        return
      } else if (datos['estado'] == 1) {
        this.usuariosService.terminarRegistro(this.formRegistro.value, this.id_usuario).subscribe(datos => {
          if (datos['resultado'] == "ERROR") {
            window.confirm("Ocurrio un error. Inténtelo más tarde.");
            return
          } else if (datos['resultado'] == "OK") {
            window.confirm("Registro completado con éxito.");
            this.usuariosService.setEstadoSesion(true);
            this.formRegistro.reset();
            this.cerrarModalRegistro.nativeElement.click();
          }
        })
      }
    });
  }

  realizarPago() {
    // Crear checkout session
    this.http.get<any>(this.datospago).subscribe(response => {
      const checkoutOptions: RedirectToCheckoutServerOptions = {
        sessionId: response.id
      };

      this.stripeService.redirectToCheckout(checkoutOptions).subscribe(result => {
        if (result.error) {
          alert('Error al realizar el pago');
        }
      });
    });
  }

  verChats() {
    this.router.navigate(['chat', this.id_chat])
  }

  createToken(): void {
    this.pagando=true;
    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
          // Use the token
          this.usuariosService.realizarPago(this.id_usuario,result.token.id).subscribe(result=>{
            console.log(result)
            if(result==true){
              this.cerrarPagar.nativeElement.click();
              this.router.navigate(['historial'])
            }else{
              window.alert("Algo ha salido mal, intentelo mas tarde")
            }
          })
          console.log(result.token);
        } else if (result.error) {
          // Error creating the token
          window.alert(result.error.message);
        }
      });
      this.pagando=false;
  }

  mostrarTarjeta(){
    this.showCreditcard=true;
    console.log(this.showCreditcard)
  }

  irChat(){
    if(this.id_chat==null){
      this.modalChat1.nativeElement.click();
    }else{
      this.verChats()
    }
  }

  crearChat(msg1){
    console.log(this.id_usuario)
    console.log(msg1)
    let id_usuario:any=localStorage.getItem("id_usuario").toString()

    let msg:string=msg1;
    if(msg.length>=10){
      this.chatService.crearChat(id_usuario, msg).subscribe(res=>{
        console.log('oli')
        this.enviarForm.patchValue({enviarInput:''})
        this.id_chat=res["id_chat"];
        console.log(this.id_chat)
        this.cerrarModalChat1.nativeElement.click();
        this.router.navigate(['chat', this.id_chat])
      })
    }else{
      window.alert("El mensaje debe de ser mayor a 10 caracteres")
    }

  }

}
