import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MDBModalRef } from 'ng-uikit-pro-standard';
import { Subject } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';


@Component({
  selector: 'app-modal-chat',
  templateUrl: './modal-chat.component.html',
  styleUrls: ['./modal-chat.component.css']
})
export class ModalChatComponent implements OnInit {
  enviarForm: FormGroup;
  oferta: any;
  id_usuario:any;
  action = new Subject();

  constructor(public modalRef: MDBModalRef,private fb:FormBuilder,private router: Router,private chatService:ChatService) {}
  formEnviarInit(){
    this.enviarForm = this.fb.group({
      enviarInput:[],
    })
  }
  ngOnInit(): void {
    this.formEnviarInit();

  }

  crearChat(msg1){
    console.log(this.id_usuario)
    console.log(this.oferta)
    console.log(msg1)

    let msg:string=msg1;
    if(msg.length>=10){
      this.chatService.crearChat(this.id_usuario, this.oferta, msg).subscribe(res=>{
        this.enviarForm.patchValue({enviarInput:''})
        let id_chat=res["id_chat"];
        this.action.next(id_chat);
        this.modalRef.hide()
      })
    }else{
      window.alert("El mensaje debe de ser mayor a 10 caracteres")
    }

  }

}
