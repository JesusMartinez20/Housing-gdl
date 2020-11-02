import { Component, OnInit, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuartosService } from '../../services/cuartos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CasasService } from '../../services/casas.service';
import { environment } from 'src/environments/environment'
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-cuarto',
  templateUrl: './cuarto.component.html'
})
export class CuartoComponent implements OnInit {

  imgUrl = environment.imgUrl;
  cuarto:any = {};
  id_semestre:number = null;
  semestres:any = [];
  imgs:any = [];
  id_cuarto:number = null;
  oferta:any = [];
  id_usuario = null;
  chatactivo = null;

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

  constructor(private activatedRoute:ActivatedRoute,
    private cuartosService:CuartosService,
    private fb:FormBuilder,
    private chatService:ChatService) { }

    formEnviarInit(){
      this.enviarForm = this.fb.group({
        enviarInput:[],
      })
    }
    ngOnInit() {
      let usuario = JSON.parse(localStorage.getItem("usuario"));
      this.id_usuario = usuario["id_usuario"];
      this.formEnviarInit();
      this.activatedRoute.params.subscribe( params => {
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

    }



  getOferta( event:any ){
    this.id_semestre = event;
    if(this.id_semestre != null){
      this.cuartosService.getOferta(this.id_semestre, this.id_cuarto).subscribe( resultado => this.oferta = resultado)
      this.chatService.comprobarChat(this.id_usuario).subscribe( resultado => this.chatactivo = resultado)
    }
    else{
      return
    }
  }

  crearChat(id_oferta:number){

    let msg:string=this.enviarForm.get('enviarInput').value;
    if(msg.length>=10){
      this.chatService.crearChat(this.id_usuario, id_oferta, msg).subscribe(res=>{
        this.enviarForm.patchValue({enviarInput:''})
        let id_chat=res;
      })
    }else{
      window.alert("El mensaje debe de ser mayor a 10 caracteres")
    }

  }




}
