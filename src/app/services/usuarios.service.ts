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
    return this.http.post(`${this.url}/login/inicioSesion.php`, USUARIO_FD).pipe(retry(3))
  }

  terminarRegistro( datos:any, nombre:string, apellido:string ){
    const DATOS_REG = serialize(datos);
    return this.http.post(`${this.url}/login/terminarRegistro.php?nombre=${nombre}&apellido=${apellido}`, DATOS_REG).pipe(retry(3))
  }

  consultaNotificacion( id:string ){
    return this.http.get(`${this.url}/login/notificacionChat.php?id=${id}`).pipe(retry(3))
  }

  consultaNotificacionBloqueo( id:string ){
    return this.http.get(`${this.url}/login/notificacionBloqueo.php?id=${id}`).pipe(retry(3))
  }

  datosPago(id_usuario:number=null){
    return this.http.get(`${this.url}/login/verPago.php?id_usuario=${id_usuario}`).pipe(retry(3))
  }
  buscarCorreo( correo:string, id:number = null ){
    return this.http.get(`${this.url}/login/consultaCorreo.php?correo=${correo}&id=${id}`).pipe(retry(3))
  }
  verVentas(id_usuario:number){
    return this.http.get(`${this.url}/datos/verDatosRenta.php?id_usuario=${id_usuario}`).pipe(retry(3))
  }






  getUsuario(id_fb:string, id_usuario:number=null){
    return this.http.get(`${this.url}getUsuario.php?id_fb=${id_fb}&id_usuario=${id_usuario}`).pipe(retry(3))
  }

  setEstadoSesion( estado:boolean ){
    this.estadoS = estado;
  }

  getEstadoSesion(){
    return this.estadoS
  }

  validarComentarios(id_usaurio:Number, id_evento:Number){
    return this.http.get(`${this.url}ValidarComentario.php?id_evento=${id_evento}&id_usuario=${id_usaurio}`).pipe(retry(3))
  }

  comprobarComentarios(id_usaurio:Number, id_evento:Number){
    return this.http.get(`${this.url}ComprobarComentario.php?id_evento=${id_evento}&id_usuario=${id_usaurio}`).pipe(retry(3))
  }

  insertarComentario(comentario:string, cal:number, id_evento:number, id_usuario:number){
    return this.http.get(`${this.url}InsertarComentario.php?comentario=${comentario}&cal=${cal}&id_evento=${id_evento}&id_usuario=${id_usuario}`).pipe(retry(3))
  }

  eliminarComentrio(id_cal:number){
    return this.http.get(`${this.url}EliminarComentario.php?id_cal=${id_cal}`).pipe(retry(3))
  }

  elementosVenta(id_venta:number){
    return this.http.get(`${this.url}VerElementosVentaIndividual.php?id_venta=${id_venta}`).pipe(retry(3))
  }

  editarInformacion(info:any){
    const INFO = serialize(info);
    return this.http.post(`${this.url}editarUsuario.php`, INFO).pipe(retry(3))
  }

  verificarPago(id_venta:number, id_usuario:number ){
    return this.http.get(`${this.url}verificarPago.php?id_venta=${id_venta}&id_usuario=${id_usuario}`).pipe(retry(3))
  }

}
