import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import {UsuariosService} from '../../services/usuarios.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {

  users:any=[];
  chatId=null;
  foto=null;
  usuario:any = null;
  loggedIn: boolean = false;

  constructor(private router: Router, private chatService:ChatService,  private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.loggedIn = this.usuariosService.getEstadoSesion();
    if (this.loggedIn == false) {
        this.router.navigate(['inicio'])
    }
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.foto = this.usuario.photoUrl;
    this.chatService.verChats(this.usuario.id_usuario).subscribe( resultado => {
      console.log(this.usuario.id_usuario)
      this.users=resultado
    });
  }

  chat(id: number) {
    //this.router.navigate(['chat-list/chat', id]);
    console.log(id)
    this.chatId=id
    this.router.navigate(['chat', id])
  }
}
