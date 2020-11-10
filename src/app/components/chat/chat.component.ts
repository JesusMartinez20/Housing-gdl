import { Component, OnInit,Input  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import {UsuariosService} from '../../services/usuarios.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() childMessage: number;
  usuario:any = {};
  msgs:any=[];
  datos:any=[];
  enviarForm: FormGroup;
  idChat:any=null;
  loggedIn: boolean = false;

  constructor(private chatService:ChatService,private activatedRoute: ActivatedRoute,private fb:FormBuilder, private usuariosService: UsuariosService, private router: Router) {
   }

  ngOnInit(): void {
    this.loggedIn = this.usuariosService.getEstadoSesion();
    if (this.loggedIn == false) {
        this.router.navigate(['inicio'])
    }
    this.formEnviarInit()
    this.activatedRoute.params.subscribe(params => {
      this.idChat=params['id']
      this.usuario = JSON.parse(localStorage.getItem("usuario"));
      this.chatService.miChat(params['id'], this.usuario.id_usuario).subscribe(resultado=>{
        if(resultado == false){
          this.router.navigate(['inicio'])
        }
      })
      this.chatService.verMensajesChat(params['id']).subscribe(resultado=>{
        this.msgs=resultado
      })
    });

  }

  formEnviarInit(){
    this.enviarForm = this.fb.group({
      enviarInput:[],
    })
  }

  enviarMensaje(){
    let msg:string=this.enviarForm.get('enviarInput').value;
    if(msg.length>=10){
      this.chatService.enviarMensaje(this.idChat,msg).subscribe(res=>{
        this.chatService.verMensajesChat(this.idChat).subscribe(resultado=>{
          this.msgs=resultado
        })
        this.enviarForm.patchValue({enviarInput:''})
      })
    }else{
      window.alert("El mensaje debe de ser mayor a 10 caracteres")
    }

  }

  // cancelar(){
  //   if (window.confirm("Está seguro de querer cancelar la conversación")) {
  //     let msg=this.enviarForm.get('enviarInput').value;
  //     if(msg.length>=10){
  //     this.chatService.cancelarChat(this.idChat,msg).subscribe(res=>{
  //       console.log(res)
  //       location.reload();
  //     })
  //   }else{
  //     window.alert("El mensaje debe de ser mayor a 10 caracteres")
  //   }
  // }
  // }
}

