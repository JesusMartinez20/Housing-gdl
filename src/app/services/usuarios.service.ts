import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { serialize } from 'object-to-formdata';
import {environment} from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  // url = "https://proyectotapatio.com/PT-API-P/usuarios/";
  url = environment.apiUrl;

  estadoS:boolean = false;

  constructor(private http:HttpClient) { }

  registrarUsuario( usuario:any ){
    const USUARIO_FD = serialize(usuario);
    return this.http.post(`${this.url}login/inicioSesion.php`, USUARIO_FD).pipe(retry(3))
  }

  terminarRegistro( datos:any, id:number){
    const DATOS_REG = serialize(datos);
    return this.http.post(`${this.url}login/terminarRegistro.php?id_usuario=${id}`, DATOS_REG).pipe(retry(3))
  }

  consultaNotificacion( id:string ){
    return this.http.get(`${this.url}login/notificacionChat.php?id=${id}`).pipe(retry(3))
  }

  consultaNotificacionBloqueo( id:string ){
    return this.http.get(`${this.url}login/notificacionBloqueo.php?id=${id}`).pipe(retry(3))
  }

  datosPago(id_usuario:number=null){
    return this.http.get(`${this.url}login/verPago.php?id_usuario=${id_usuario}`).pipe(retry(3))
  }
  buscarCorreo( correo:string, id:number = null ){
    return this.http.get(`${this.url}login/consultaCorreo.php?correo=${correo}&id=${id}`).pipe(retry(3))
  }
  verVentas(id_usuario:number){
    return this.http.get(`${this.url}datos/verDatosRenta.php?id_usuario=${id_usuario}`).pipe(retry(3))
  }
  insertarComentario(comentario:string, cal_instalaciones:number, cal_limpieza:number, cal_ambiente:number, id_evento:number, id_usuario:number){
    return this.http.get(`${this.url}casas/comentario/insertarComentario.php?comentario=${comentario}&instalacion=${cal_instalaciones}&limpieza=${cal_limpieza}&ambiente=${cal_ambiente}&id_evento=${id_evento}&id_usuario=${id_usuario}`).pipe(retry(3))
  }
  eliminarComentrio(id_cal:number){
    return this.http.get(`${this.url}casas/comentario/eliminarComentario.php?id_calificacion=${id_cal}`).pipe(retry(3))
  }
  validarComentarios(id_usuario:Number, id_casa:Number){
    return this.http.get(`${this.url}casas/comentario/validarComentario.php?id_evento=${id_casa}&id_usuario=${id_usuario}`).pipe(retry(3))
  }

  comprobarComentarios(id_usuario:Number, id_casa:Number){
    return this.http.get(`${this.url}casas/comentario/comprobarComentario.php?id_evento=${id_casa}&id_usuario=${id_usuario}`).pipe(retry(3))
  }
  getUsuario(id:string){
    return this.http.get(`${this.url}login/getUsuario.php?id_fb=${id}S`).pipe(retry(3))
  }

  setEstadoSesion( estado:boolean ){
    this.estadoS = estado;
  }

  getEstadoSesion(){
    return this.estadoS
  }
  editarInformacion(info:any){
    const INFO = serialize(info);
    return this.http.post(`${this.url}login/editarUsuario.php`, INFO).pipe(retry(3))
  }






  elementosVenta(id_venta:number){
    return this.http.get(`${this.url}VerElementosVentaIndividual.php?id_venta=${id_venta}`).pipe(retry(3))
  }



  verificarPago(id_venta:number, id_usuario:number ){
    return this.http.get(`${this.url}verificarPago.php?id_venta=${id_venta}&id_usuario=${id_usuario}`).pipe(retry(3))
  }

}
