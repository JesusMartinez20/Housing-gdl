import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import {environment} from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  // url = "https://proyectotapatio.com/PT-API-P/publicaciones/";
  url = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getPublicaciones(){
    return this.http.get(`${this.url}/pagina/verPublicacionesRecientes.php`).pipe(retry(3))
  }

  getPublicacion( id_publicacion:number ){
    return this.http.get(`${this.url}/publicaciones/verPublicacion.php?id_publicacion=${id_publicacion}`).pipe(retry(3))
  }

  getImgs( id:number ){
    return this.http.get(`${this.url}/publicaciones/verImgsPublicacion.php?id_publicacion=${id}`).pipe(retry(3))
  }

  buscarPub( nombre:string ){
    return this.http.get(`${this.url}/publicaciones/buscarPublicacion.php?nombre_pub=${nombre}`).pipe(retry(3))
  }
}
