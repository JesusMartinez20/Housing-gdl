import { Component, OnInit, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuartosService } from '../../services/cuartos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CasasService } from '../../services/casas.service';
import { environment } from 'src/environments/environment'
import { ChatService } from '../../services/chat.service';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';
import { ModalChatComponent } from '../modal-chat/modal-chat.component';
import {UsuariosService} from '../../services/usuarios.service';

@Component({
  selector: 'app-cuarto',
  templateUrl: './cuarto.component.html'
})
export class CuartoComponent implements OnInit {

  loggedIn: boolean = false;
  ver: boolean = false;
  imgUrl = environment.imgUrl;
  cuarto:any = {};
  id_semestre:number = null;
  semestres:any = [];
  imgs:any = [];
  id_cuarto:number = null;
  oferta:any = [];
  id_usuario = null;
  chatactivo = null;

  @ViewChild('cerrar',{ static: false }) cerrar;
  @ViewChild('modalRegistro',{ static: false }) modalRegistro;
  @ViewChild('cerrarModalRegistro',{ static: false }) cerrarModalRegistro;
  @ViewChild('modalPago',{ static: false }) modalPago;
  @ViewChild('cerrarModalPago',{ static: false }) cerrarModalPago;
  @ViewChild('modalBloqueo',{ static: false }) modalBloqueo;
  @ViewChild('cerrarModalBloqueo',{ static: false }) cerrarModalBloqueo;

  public customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['Anterior', 'Siguietne'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },
    nav: true
  }

  enviarForm: FormGroup;
  modalRef: MDBModalRef;

  constructor(private activatedRoute:ActivatedRoute,
    private cuartosService:CuartosService,
    private fb:FormBuilder,
    private chatService:ChatService,
    private modalService: MDBModalService,
    private usuariosService: UsuariosService,
    private router: Router) { }

    formEnviarInit(){
      this.enviarForm = this.fb.group({
        enviarInput:[],
      })
    }
    ngOnInit() {
      this.loggedIn = this.usuariosService.getEstadoSesion();
      this.formEnviarInit();
      this.activatedRoute.params.subscribe( params => {
        if (this.loggedIn) {
          let usuario = JSON.parse(localStorage.getItem("usuario"));
          this.id_usuario = usuario["id_usuario"];
          this.ver = true;
        }
        this.cuartosService.getCuarto(params['id']).subscribe( resultado => {

          this.cuarto = resultado[0];
          console.log(this.cuarto.descripcion_cuarto);
        });
        this.cuartosService.getImgs(params['id']).subscribe(resultado => {
          this.imgs = resultado
          console.log(this.imgs)
        });
        this.cuartosService.getSemestres().subscribe(resultado => {
          this.semestres = resultado
        });
        this.id_cuarto = params['id'];
      });

      this.modalService.open.subscribe(() => console.log('open'));
      this.modalService.opened.subscribe(() => console.log('opened'));
      this.modalService.close.subscribe(() => console.log('close'));
      this.modalService.closed.subscribe(() => console.log('closed'));
    }



  getOferta( event:any ){
    this.id_semestre = event;
    if(this.id_semestre != null){
      this.cuartosService.getOferta(this.id_semestre, this.id_cuarto).subscribe( resultado => this.oferta = resultado)
      this.chatService.comprobarChat(this.id_usuario).subscribe( resultado => this.chatactivo = resultado['id_chat'])
    }
    else{
      return
    }
  }

  crearChat(){
    console.log(this.oferta)
    // let msg:string=this.enviarForm.get('enviarInput').value;
    // if(msg.length>=10){
    //   this.chatService.crearChat(this.id_usuario, id_oferta, msg).subscribe(res=>{
    //     this.enviarForm.patchValue({enviarInput:''})
    //     let id_chat=res["id_chat"];
    //   })
    // }else{
    //   window.alert("El mensaje debe de ser mayor a 10 caracteres")
    // }

  }

  modalOptions = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: false,
    ignoreBackdropClick: false,
    class: '',
    containerClass: '',
    animated: true,
    data: {
      oferta:null,
      id_usuario:null
    }
  }

  openModal() {

    this.modalOptions.data.oferta=this.oferta.fk_oferta
    this.modalOptions.data.id_usuario=this.id_usuario
    console.log(this.oferta)
    this.modalRef = this.modalService.show(ModalChatComponent, this.modalOptions)
    this.modalRef.content.action.subscribe( (result: any) => {
      console.log(result);
      this.router.navigate(['chat', result])
    });
  }
  verChat() {
    this.router.navigate(['chat', this.chatactivo])
  }


}
