import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { serialize } from 'object-to-formdata';
import {environment} from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ChatService {

// url = "https://proyectotapatio.com/PT-API-P/repartidores/";
url = environment.apiUrl+"casas/chat/";

constructor(private http:HttpClient) { }

cambiarEstadoNotificacion( id_chat:number){
  return this.http.get(`${this.url}cambiarEstadoNotificacion.php?id_chat=${id_chat}`)//.pipe(retry(3))
}

cancelarChat( id_chat:number, mensaje:string){
  return this.http.get(`${this.url}cancelarChat.php?id_chat=${id_chat}&mensaje=${mensaje}`)//.pipe(retry(3))
}

enviarMensaje(id_chat:number, mensaje:string){
  return this.http.get(`${this.url}enviarMensaje.php?id_chat=${id_chat}&mensaje=${mensaje}`)//.pipe(retry(3))
}

verChats(){
  return this.http.get(`${this.url}verChats.php`)//.pipe(retry(3))
}

verDatosChat(id_chat:number){
  return this.http.get(`${this.url}verDatosChat.php?id_chat=${id_chat}`)//.pipe(retry(3))
}

verMensajesChat(id_chat:number){
  return this.http.get(`${this.url}verMensajesChat.php?id_chat=${id_chat}`)//.pipe(retry(3))
}

crearChat(id_usuario:number, id_oferta:number, mensaje:string){
  return this.http.get(`${this.url}crearChat.php?id_usuario=${id_usuario}&id_oferta=${id_oferta}&mensaje=${mensaje}`)//.pipe(retry(3))
}

comprobarChat(id_usuario:number){
  return this.http.get(`${this.url}comprobarChat.php?id_usuario=${id_usuario}`)//.pipe(retry(3))
}


}
