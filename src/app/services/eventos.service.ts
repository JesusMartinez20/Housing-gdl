import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { serialize } from 'object-to-formdata';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  // url = "https://proyectotapatio.com/PT-API-P/eventos/";
  url = "http://localhost:8080/PT-API/eventos/";

  eventos = null;

  constructor(private http:HttpClient ) { }

  getEventos( tipo:number=-1 ){
    return this.http.get(`${this.url}getEventos.php?tipo=${tipo}`).pipe(retry(3));
  }

  getEvento( id:number ){
    return this.http.get(`${this.url}getEvento.php?id_evento=${id}`).pipe(retry(3))
  }

  getImgs( id:number ){
    return this.http.get(`${this.url}getImagenes.php?id_evento=${id}`).pipe(retry(3))
  }

  getCarousel(){
    return this.http.get(`${this.url}getCarousel.php`).pipe(retry(3))
  }

  buscarEvento( nombre:string ){
    return this.http.get(`${this.url}buscarEvento.php?nombre_evento=${nombre}`).pipe(retry(3))
  }

  getComentarios(id_evento:Number){
    return this.http.get(`${this.url}VerComentarios.php?id_evento=${id_evento}`).pipe(retry(3))
  }

  getEstadoEvento(id_evento){
    return this.http.get(`${this.url}getEstadoEvento.php?id_evento=${id_evento}`).pipe(retry(3))
  }

  filtrarEventos( filtros:any ){
    const FILTROS = serialize(filtros);
    return this.http.post(`${this.url}filtroEventos.php`,FILTROS).pipe(retry(3))
  }
}
