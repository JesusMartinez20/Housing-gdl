import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { serialize } from 'object-to-formdata';
import {environment} from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CasasService {

  // url = "https://proyectotapatio.com/PT-API-P/eventos/";
  url = environment.apiUrl;

  eventos = null;

  constructor(private http:HttpClient ) { }

  /*getEventos( tipo:number=-1 ){
    return this.http.get(`${this.url}getEventos.php?tipo=${tipo}`).pipe(retry(3));
  }

  buscarEvento( nombre:string ){
    return this.http.get(`${this.url}buscarEvento.php?nombre_evento=${nombre}`).pipe(retry(3))
  }

  getEvento( id:number ){
    return this.http.get(`${this.url}getEvento.php?id_evento=${id}`).pipe(retry(3))
  }


  */

  getImgs( id:number ){
    return this.http.get(`${this.url}/casas/verImgsCasa.php?id_casa=${id}`).pipe(retry(3))
  }
  getCasa( id:number ){
    return this.http.get(`${this.url}/casas/verCasa.php?id_casa=${id}`).pipe(retry(3))
  }


  getComentarios(id_casa:Number){
    return this.http.get(`${this.url}/casas/comentarios/VerComentarios.php?id_casa=${id_casa}`).pipe(retry(3))
  }

  filtrarCasas( filtro:any ){
    const FILTRO = serialize(filtro);
    return this.http.post(`${this.url}filtroEventos.php`,FILTRO).pipe(retry(3))
  }

  getCarousel(){
    return this.http.get(`${this.url}/Pagina/verCarousel.php`).pipe(retry(3))
  }
  getCasas(){
    return this.http.get(`${this.url}/Casas/VerCasas.php`).pipe(retry(3));
  }


}
